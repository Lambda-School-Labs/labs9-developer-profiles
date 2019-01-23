import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components';
import { centerFlex } from '../../../global-styles/Mixins';


class Billing extends Component {
  state = {
    
  }

  componentDidMount() {
    // for returning users
    // get data from session storage
    // hydrate state
    // remove from session storage
    var handler = window.StripeCheckout.configure({
      key: 'pk_test_V4TVCnAGCgyfBK9pXODIWhfA',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token.id)
        axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/api/billing`, {stripeToken: token.id}).then(res => console.log(res)).catch(err => console.log(err))
      }
    });
    
    document.getElementById('customButton').addEventListener('click', function(e) {
      // Open Checkout with further options:
      handler.open({
        name: 'Demo Site',
        description: '2 widgets',
        amount: 2000
      });
      e.preventDefault();
    });
  }

  render() {
    return (
      <MainFormContainer>
        <button id="customButton">Purchase</button>
      </MainFormContainer>
    )
  }
}

const MainFormContainer = styled.main`
  width: calc(100% - 300px);
  margin-left: 300px;
  margin-bottom: 100px;
  padding-top: 50px;
  ${centerFlex()};
  @media (max-width: 1400px) {
    width: calc(100% - 80px);
    margin-left: 80px;
  }
`;

export default Billing;
