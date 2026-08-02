import React from 'react';
import './Single.css'
import { FaMinus, FaXmark } from "react-icons/fa6";
import { FaLess, FaPlus, FaShippingFast, FaStar, FaStarHalf } from 'react-icons/fa';
import Image from '../../assets/ValleyEats.png';
export default function Single() {
  const toggleSingle = () => {
    document.querySelector('.single').classList.toggle('active');
  }
  return (
    <div className='single'>
      <div className="wrapper">
        <div className="image">
            <img src={Image} alt="" />
        </div>
        <div className="details">
            <h1 >Tony Hunfinger T-Shirt New York</h1>
            <span className='pricing'>
                <h3 className="sub-heading">$800.00</h3>
                <a className="icon badge">Free Shipping<FaShippingFast /></a>
            </span>
            <p>
               Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Sit Natus Dolor Cumque.
               Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Sit Natus Dolor Cumque.
            </p>
            <div className="stars">
                <FaStar className='star'/>
                <FaStar className='star'/>
                <FaStar className='star'/>
                <FaStar className='star'/>
                <FaStarHalf className='star'/>
            </div>
            <span>
                <div className="disabled">
                    <a href="#" className="icon eye"><FaMinus /></a>
                    <h3 className="sub-heading">5</h3>
                    <a href="#" className="icon eye"><FaPlus /></a>
                </div>
                <a href="#" className="btn">Add To Cart</a>
                <a href="#" className="btn">Buy Now</a>
            </span>
        </div>
      </div>
      <span id="close" onClick={toggleSingle}><FaXmark /></span>
    </div>
  )
}
