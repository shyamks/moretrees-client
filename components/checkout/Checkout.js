// MyStoreCheckout.js
import React from 'react';
import { CardElement,
  Elements,
  injectStripe,} from 'react-stripe-elements-universal';
import './checkout.css'

class _CardForm extends React.Component {
  render() {
    return (
      <form onSubmit={() => this.props.stripe.createToken().then(payload => console.log(payload))}>
        <CardElement />
        <button>Donate</button>
      </form>
    )
  }
}
const CardForm = injectStripe(_CardForm)

class Checkout extends React.Component {
  render() {
    return (
      <div className="Checkout">
        <Elements>
          <CardForm />
        </Elements>
      </div>
    )
  }
}

export default Checkout;