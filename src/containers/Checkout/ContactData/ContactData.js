import React, { Component } from 'react';

import  Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders.js';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
        name: {
          elemetType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Your Name'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false
        },
        street: {
          elemetType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Street'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false
        },
        postcode: {
          elemetType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Post Code'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6,
            maxLength: 6
          },
          valid: false
        },
        country: {
          elemetType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Country'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false
        },
        email: {
          elemetType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Your E-mail'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false
        },
        deliveryMethod: {
          elemetType: 'select',
          elementConfig: {
            options: [
              {value: 'fastest', displayValue: 'Fastest'},
              {value: 'cheapest', displayValue: 'Cheapest'}
            ]
          },
          value: ''
        },
    },
    loading: false
  }

  checkValidity(value, rules) {
    let isValid = false;

    if (rules.required) {
        isValid = value.trim() !== '';
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength
    }
    
    return isValid;
  }

  orderHandler = ( event ) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false});
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ loading: false});
      });
    console.log(this.props.ingredients)
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    console.log(updatedFormElement);
    this.setState({orderForm: updatedOrderForm});
  }

  render (){
    const formElementsArray = [];
    for (let key in this.state.orderForm){
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elemetType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
        ))}
        <Button btnType="Success">ORDER</Button>
      </form>
    );
    if (this.state.loading){
      form = <Spinner />;
    }
    return(
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}



export default ContactData;
