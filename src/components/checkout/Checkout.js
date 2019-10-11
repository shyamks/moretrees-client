// MyStoreCheckout.js
import React from 'react';
import './checkout.css'

class Checkout extends React.Component {
  render() {
    return (
      <div className="alignStripeContainer">
        <button className="stripeButton" onClick={this.props.onSubmit}>Donate</button>
      </div>
    )
  }
}

export default Checkout;
