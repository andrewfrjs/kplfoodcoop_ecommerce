import { FaXmark, FaMinus, FaPlus } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import './CartItem.scss';

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();
  const product = item.products;

  const change = async (delta) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    await updateQty(item.id, next);
  };

  if (!product) return null;
  const lineTotal = Number(product.price) * item.quantity;

  return (
    <div className="cart-item">
      <div className="preview">
        <img src={product.image_url} alt={product.title} />
        <div className="info">
          <Link to={`/shop/${product.slug}`}><h3>{product.title}</h3></Link>
          <span className="unit-price">{Number(product.price).toLocaleString()} KSH each</span>
        </div>
      </div>

      <div className="qty">
        <button onClick={() => change(-1)}><FaMinus /></button>
        <span>{item.quantity}</span>
        <button onClick={() => change(1)} disabled={item.quantity >= product.stock}><FaPlus /></button>
      </div>

      <div className="line-total">{lineTotal.toLocaleString()} KSH</div>

      <button className="remove" onClick={() => removeFromCart(item.id)} title="Remove">
        <FaTrash />
      </button>
    </div>
  );
}
