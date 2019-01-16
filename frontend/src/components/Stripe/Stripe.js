import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";

class Stripe extends Component {
  render() {
    return (
      <StripeProvider apiKey="pk_test_8GJbtgDBTy9PWsnFvDsQo8e7">
        <div className="example">
          <h1>React Stripe Elements Example</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default Stripe;