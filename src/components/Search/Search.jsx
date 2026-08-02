import './Search.scss';
import { FaXmark } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
    const handleCloseSearch = () => {
        document.querySelector('.search-form').classList.toggle('active');
    }
  return (
    <form action='' className='search-form'>
        <input type="search" placeholder='search here...' name="" id="search-box" autoFocus/>
        <label htmlFor="search-box"><FaSearch /></label>
        <span id="close" onClick={handleCloseSearch}><FaXmark /></span>
    </form>
  )
}
