import React from 'react'
import './Menu.css';
import Image1 from '../../assets/products/images (9).jpg';
import Image2 from '../../assets/products/images (9).jpg';
import Image3 from '../../assets/products/download (13).jpg';
import Image4 from '../../assets/products/collard.jpg';
import Image5 from '../../assets/products/download (12).jpg';
import Image6 from '../../assets/products/download (16).jpg';
import {FaEye, FaStar, FaStarHalf } from "react-icons/fa";

export default function Menu() {
  const toggleSingle = () => {
    document.querySelector('.single').classList.toggle('active');
  }
  const dishes = [
    {
      id: 1,
      title: "Black Bird Red Wine",
      price: 3499,
      image: Image1,
      description: "Natural Sweet Red Wine, Scottish 1992",
      stars: 5.0,
      
    },
    {
      id: 2,
      title: "1kg, red tomatoes",
      price: 259,
      image: Image2,
      description: "Red tomatoes",
      stars: 4.5,
      
    },
    {
      id: 3,
      title: "delicious food",
      price: 550,
      image: Image3,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit natus dolor cumque.",
      stars: 4.5,
      
    },
    {
      id: 4,
      title: "tasty food",
      price: 550,
      image: Image4,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit natus dolor cumque.",
      stars: 4.5,
      
    },
    {
      id: 5,
      title: "delicious food",
      price: 550,
      image: Image5,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit natus dolor cumque.",
      stars: 4.5,
      
    },
    {
      id: 6,
      title: "delicious food",
      price: 550,
      image: Image6,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit natus dolor cumque.",
      stars: 4.5,
      
    },
  ];
    const Item = ({data}) => {
      return(
        <div className="card">
            <div className="image">
                <img src={data.image} alt="" />
                <a className="icon eye" onClick={toggleSingle}><FaEye /></a> 
            </div>
            <div className="content">
                <div className="stars">
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStar className='star'/>
                        <FaStarHalf className='star'/>
                </div>
                <h3>{data.title}</h3>
                <p>{data.description}</p>
                <a href="#" className="btn">add to cart</a>
                <span className="price">KSH {data.price}</span>
            </div>
        </div>)
    }
  return (
    <section className='menu' id='menu'>
        <h3 className="sub-heading">Discover More</h3>
        <h1>Trending Today</h1>
        <div className="container">
          {
            dishes && dishes.map(item => {
              return <Item data={{...item}} key={item.id} />
            })
          }
        </div>
    </section>
  )
}
