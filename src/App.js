import React, { Component } from 'react';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Layout from './containers/Layout/Layout';


class App extends Component {

  render(){
    return (
      <div className="App">
        <Layout>
          <BurgerBuilder />
          <Checkout />
        </Layout>
      </div>
    );
  }
}

export default App;
