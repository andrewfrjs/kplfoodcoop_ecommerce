import './Review.scss';
import { FaQuoteRight, FaStar, FaStarHalf } from 'react-icons/fa';

const reviews = [
  { name: 'Amina Wanjiru', text: 'Fast delivery and the produce was genuinely fresh. The sukuma wiki lasted a whole week!', role: 'Verified Buyer' },
  { name: 'Brian Otieno', text: 'I ordered a sack of rice and eggs — saved me a trip to the market. Fair prices and great service.', role: 'Verified Buyer' },
  { name: 'Faith Chebet', text: 'The checkout was smooth and my order arrived the same day. Highly recommend KPL FoodCoop.', role: 'Verified Buyer' },
];

export default function Review() {
  return (
    <section className="review" id="review">
      <div className="section-header">
        <p className="sub-heading">customer reviews</p>
        <h1 className="heading">What they say</h1>
      </div>
      <div className="review-grid">
        {reviews.map((r, i) => (
          <div className="slide" key={i}>
            <span className="quote"><FaQuoteRight /></span>
            <div className="stars">
              <FaStar className="star" /><FaStar className="star" /><FaStar className="star" /><FaStar className="star" /><FaStarHalf className="star" />
            </div>
            <p>{r.text}</p>
            <div className="user">
              <div className="avatar">{r.name.charAt(0)}</div>
              <div className="user-info">
                <h3>{r.name}</h3>
                <span>{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
