import './Review.scss';
import Image from '../../assets/react.svg';
import {FaQuoteRight, FaStar, FaStarHalf } from "react-icons/fa";

export default function Review() {
    const Item = () => {
        return (
        <div className="slide">
            <span>
                <FaQuoteRight />
            </span>
            <div className="user">
                <img src={Image} alt="" />
                <div className="user-info">
                    <h3>John deo</h3>
                    <div className="stars">
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStarHalf className='star'/>
                    </div>
                </div>
            </div>
            <p>Lorem ipsum dolo sit amet. Lorem ipsum dolo sit amet. Lorem ipsum dolo sit amet.</p>
        </div>
        );
    }
  return (
    <section className='review' id='review'>
        <h3 className="sub-heading">customer reviews</h3>
        <h1 className='heading'>What they say</h1>
        <div className="review-slider">
            <div className="wrapper">
                <Item />
                <Item />
                <Item />
            </div>
        </div>
    </section>
  )
}
