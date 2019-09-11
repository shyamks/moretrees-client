// MyStoreCheckout.js
import React from 'react';
import {
  CardElement,
  Elements,
  injectStripe
} from 'react-stripe-elements-universal';
import './checkout.css'


class _CardForm extends React.Component {

  submit = async (ev) => {
    const callback = async () => {
      let {token} = await this.props.stripe.createToken();
      return token
    }
    this.props.onSubmit(callback);
  }

  render() {
    return (
      <div>
        <CardElement />
        <button className="stripeButton" onClick={this.submit}>Donate</button>
      </div>
    )
  }
}
const CardForm = injectStripe(_CardForm)

class Checkout extends React.Component {
  render() {
    return (
      <div className="Checkout">
        <Elements>
          <CardForm onSubmit={this.props.onSubmit}/>
        </Elements>
      </div>
    )
  }
}

export default Checkout;
