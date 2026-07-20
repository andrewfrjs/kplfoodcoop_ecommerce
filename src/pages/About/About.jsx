import './About.css';
import { FaCheckCircle, FaDollarSign, FaFacebook, FaHeadset, FaInstagram, FaShippingFast, FaTwitter } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Faq from '../../components/FaqItem/Faq';
import Review from '../../components/Review/Review';
import Newsletter from '../../components/Newsletter/Newsletter';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="about">
      <div className="channel-info">
        <div className="container">
          <div className="channel-icon">
            <span className="logo-mark">KPL</span>
          </div>
          <div className="channel-title">
            <h1>KPL FoodCoop <FaCheckCircle className="check" /></h1>
            <p>Trusted by 100k+ shoppers across Kenya</p>
          </div>
        </div>
        <p className="intro">
          Welcome to KPL FoodCoop — your online grocery cooperative. We connect you directly with local farmers
          to bring fresh, quality produce to your door at fair prices. Shop groceries, manage orders, and track
          deliveries all in one place.
        </p>
        <div className="socials">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><FaXTwitter /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <Link to="/contact-us" className="btn btn-green">Contact Us</Link>
        </div>
      </div>

      <div className="row">
        <div className="image">
          <img src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Local farm" />
        </div>
        <div className="content">
          <p className="sub-heading">Our story</p>
          <h1>Bringing farms to your table</h1>
          <p>
            KPL FoodCoop started with a simple idea: make fresh food accessible and affordable while supporting
            the farmers who grow it. We cut out the middlemen so you get better prices and farmers get a fair deal.
            Today we serve thousands of households across Nairobi and beyond.
          </p>
        </div>
      </div>

      <div className="row reverse">
        <div className="image">
          <img src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fresh produce" />
        </div>
        <div className="content">
          <p className="sub-heading">Our mission</p>
          <h1>Fresh food for every household</h1>
          <p>
            We believe everyone deserves access to nutritious, fresh food. Our mission is to build Kenya's most
            trusted food cooperative — one that supports local agriculture, reduces food waste, and delivers
            quality you can taste.
          </p>
        </div>
      </div>

      <div className="section-header">
        <p className="sub-heading">Why us</p>
        <h1 className="heading">Why choose KPL FoodCoop?</h1>
      </div>

      <div className="features">
        <div className="feature">
          <FaShippingFast className="icon" />
          <h3>Fast Delivery</h3>
          <p>Same-day delivery in Nairobi. Next-day everywhere else.</p>
        </div>
        <div className="feature">
          <FaDollarSign className="icon" />
          <h3>Fair Prices</h3>
          <p>Direct from farmers, no middlemen markups.</p>
        </div>
        <div className="feature">
          <FaHeadset className="icon" />
          <h3>24/7 Support</h3>
          <p>Our team is here whenever you need help.</p>
        </div>
      </div>

      <div className="section-header">
        <p className="sub-heading">FAQ</p>
        <h1 className="heading">Frequently Asked Questions</h1>
      </div>
      <Faq />

      <Review />
      <Newsletter />
    </section>
  );
}
