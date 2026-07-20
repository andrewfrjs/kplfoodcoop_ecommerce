import './Flyer.scss';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

export default function Flyer() {
  return (
    <div className="flyer">
      <div className="content">
        <span className="badge badge-green">Limited offer</span>
        <h1>Fresh produce, delivered to your door</h1>
        <p>Shop quality groceries from local farmers. Free delivery on orders above KSH 3,000.</p>
        <Link to="/shop" className="btn btn-green btn-lg">
          Shop Now <FaArrowRight />
        </Link>
      </div>
      <div className="image">
        <img src="https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Fresh groceries" />
      </div>
    </div>
  );
}
