import './NotFound.css';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="nf-content">
        <h1 className="code">404</h1>
        <h2 className="sub-heading">Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-green btn-lg">Go Home</Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary btn-lg">Go Back</button>
        </div>
      </div>
    </section>
  );
}
