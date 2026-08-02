import { useEffect, useState } from 'react';
import './Topnav.scss';
import { FaBars, FaHeart, FaSearch, FaShoppingCart } from "react-icons/fa";
import { FaLandmark, FaLandMineOn, FaWineGlass, FaXmark } from "react-icons/fa6";
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../assets/categories/other.jpg';
import { HiShoppingBag } from 'react-icons/hi';


export default function Topnav() {
    const [opened, setOpened] = useState(false)
    const [user, setUser] = useState(null);
    const handleToggle = () => {
        //document.querySelector('#menu-bars').classList.toggle('displayed');
        setOpened(!opened);
        document.querySelector('nav').classList.toggle('active');
    }

    const handleOpenSearch = () => {
        document.querySelector('.search-form').classList.toggle('active');
    }

    useEffect(() => {
        document.body.onscroll = () => {
            if(document.querySelector('nav').classList.contains('active')) {
                setOpened(false);
                document.querySelector('nav').classList.remove('active');
            }
        }
    }, [])

  return (
    <header> 
        {/*<a href="/" className="logo">
            <img src={Logo} alt="" />
        </a>*/} 
        <a href="/" className="logo">< HiShoppingBag className='icon'/>LiquorsKE</a>
        <nav>
            <NavLink to="/" onClick={handleToggle}>Home</NavLink>
            <NavLink to="shop" onClick={handleToggle}>Store</NavLink>
            <NavLink to="blogs" onClick={handleToggle}>Blog</NavLink>
            <NavLink to="about-us" end onClick={handleToggle}> About Us</NavLink>
            <NavLink to="contact-us" end onClick={handleToggle}>Contact Us</NavLink>
            {!user && <NavLink to="/get-started" className="btn">Get Started</NavLink>}
        </nav>
        <div className="icons">
            <div className="icon" id='menu-bars' onClick={handleToggle}>
                {opened ? <FaXmark /> : <FaBars />}
            </div>
            <div className="icon" id='search-icon'  onClick={handleOpenSearch}><FaSearch/></div>
            <NavLink to='cart' className='icon' id='bars'><span>3</span><FaShoppingCart /></NavLink>
            {user && <a href='#' className='icon' id='favorite'><FaHeart /></a>}
        </div>
    </header>
  )
}
