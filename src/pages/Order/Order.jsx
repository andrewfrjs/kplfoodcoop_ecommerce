import React from 'react';
import './Order.css';

export default function Order() {
  return (
    <section className='order' id='order'>
        <h3 className="sub-heading">order now</h3>
        <h1>free and fast</h1>

        <form action="">
            <div className="inputBox">
                <div className="input">
                    <span>You Name</span>
                    <input type="text" placeholder='enter you name'/>
                </div>
                <div className="input">
                    <span>You number</span>
                    <input type="number" placeholder='enter you number'/>
                </div>
            </div>
            <div className="inputBox">
                <div className="input">
                    <span>You order</span>
                    <input type="text" placeholder='enter food name'/>
                </div>
                <div className="input">
                    <span>additional food</span>
                    <input type="test" placeholder='extra with food'/>
                </div>
            </div>
            <div className="inputBox">
                <div className="input">
                    <span>You much</span>
                    <input type="text" placeholder='how many orders'/>
                </div>
                <div className="input">
                    <span>date and time</span>
                    <input type='datetime-local'/>
                </div>
            </div>
            <div className="inputBox">
                <div className="input">
                    <span>You address</span>
                    <textarea name="address" placeholder="enter your address" cols="30" rows="10"/>
                </div>
                <div className="input">
                    <span>You message</span>
                    <textarea name="address" placeholder="enter your address" cols="30" rows="10"/>
                </div>
            </div>
            <input type="submit" value="order now" className='btn'/>
        </form>
    </section>
  )
}
