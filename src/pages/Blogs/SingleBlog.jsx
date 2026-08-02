import React, { useState } from 'react'
import Image from '../../assets/chicken.jpg';
import { FaTimeline } from 'react-icons/fa6';
import { FaArrowAltCircleLeft, FaDAndD } from 'react-icons/fa';
import BlogItem from './BlogItem';
import { NavLink } from 'react-router-dom';
import Newsletter from '../../components/Newsletter/Newsletter';
import { ShareSocial } from 'react-share-social';

export default  function SingleBlog() {
  const [visible, setVisible] = useState(false);
const readingTime = (articleText) => {
    const wordsArray = articleText.split(' ');
    // Count the number of words in the array
    const wordCount = wordsArray.length;
    // Calculate the estimated reading time
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
}
  
  
  
  
  return(
    <div className="card blog">
        <NavLink className="btn"><FaArrowAltCircleLeft /> Back</NavLink>
        <div className="image">
            <img src={Image} alt=""/>
        </div>
        <div className="content">
            <div className="meta">
                <div className="trailing">
                    <span>{new Date().toDateString()}</span>
                </div>
                <div className="duration"> {readingTime("Lorem ipsum")} min read</div>
            </div>
            <p>
              <div className="hash">special</div>
              <div className="hash">menu</div>
              <div className="hash">calorie-free</div>
            </p>
            <h3>Delicious chicken piece</h3>
            <p>1 chicken piece with regular chips.</p>
        </div>
        <h1 className="heading">Similar Articles</h1>
        <div className="container">
            <BlogItem />
            <BlogItem />
            <BlogItem />
        </div>
        <ShareSocial url ={window.location.href} socialTypes={['facebook','twitter','reddit','linkedin']} title={'share this page'} />
    </div>)
}