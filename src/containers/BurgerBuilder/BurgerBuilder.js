import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders.js'
import * as actionTypes from '../../store/actions';
import { connect } from 'react-redux';

class BurgerBuilder extends Component {
  state = {
    purchasable: false,
    // Could argue that the three below are Local UI state
    purchasing: false,
    loading: false,
    error: null
  }

  componentDidMount() {
    console.log(this.props);
    // axios.get('https://react-my-buger-39b2c.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ingredients: response.data})
    //   })
    //   .catch(error => {
    //     this.setState({error: true})
    //   });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum+el;
      }, 0);
      this.setState({purchasable: sum > 0});
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.state.ingredients){
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    // Push as a query params to Checkout component
    queryParams.push('price=' + this.props.price);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });

  }
  render() {
    const disabledInfo = {
      ...this.props.ing
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <=0
    }
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
    // Only set this if it is not null
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings}/>
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            ordered={this.purchaseHandler}
            purchasable={this.state.purchasable}/>
        </Aux>
      );
      orderSummary = <OrderSummary
        ingredients={this.props.ings}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.props.price}/>;
    };
    if (this.state.loading){
      orderSummary = <Spinner />;
    }
    // { salad:true, meat:false, cheese:...}
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
          {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingredName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingredName}),
    onIngredientRemoved: (ingredName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingredName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
