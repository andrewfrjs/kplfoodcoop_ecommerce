import './Search.scss';
import { FaXmark } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleCloseSearch = () => {
    document.querySelector('.search-form').classList.remove('active');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      handleCloseSearch();
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search products..."
        id="search-box"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <label htmlFor="search-box" onClick={handleSubmit}><FaSearch /></label>
      <span id="close" onClick={handleCloseSearch}><FaXmark /></span>
    </form>
  );
}
