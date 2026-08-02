import React from 'react';
import './Cart.scss'
import CartItem from '../../components/CartItem/CartItem';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';

export default function Cart() {
    return (
	<section className="cart">
		    <a href="/shop" className='btn'><FaArrowLeft/> continue shopping</a>
			<h1>My Cart (6)</h1>
		    <div className="content">
	 			<div className="row">

	 				<div className="items">
					    <div className='item-header'>
							<p>item</p>
							<p className="quantity">quantity</p>
							<p className="multiply">price</p>
							<p className="total">sub-total (KSH)</p>
						</div>
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
			 		</div>

			 		<div className="summary    col-md-12 col-lg-4">
                        <h3>Summary</h3>
                        <div className="summary-item"><span className="text">Subtotal</span><span className="price">$360</span></div>
                        <div className="summary-item"><span className="text">Discount</span><span className="price">$0</span></div>
                        <div className="summary-item"><span className="text">Shipping</span><span className="price">$0</span></div>
                        <div className="summary-item"><span className="text">Total</span><span className="price">$360</span></div>
                        <a href='/checkout' type="button" className="btn btn-primary btn-lg btn-block">Checkout</a>
					</div>
		 		</div> 
		 	</div>
	</section>
  )
}
