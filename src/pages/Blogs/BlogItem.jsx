import React, { useState } from 'react'
import Image from '../../assets/chicken.jpg';

export default  function BlogItem() {
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
        <div className="image">
            <img src={Image} alt="" />
        </div>
        <div className="content">
            <div className="meta">
                <span className='trailing'>{new Date().toDateString()}</span>
                <div className="duration">{readingTime("Lorem ipsum")} min read</div>
            </div>
            <a href="/blogs/id-here"><h3>Delicious chicken piece</h3></a>
            <p>1 chicken piece with regular chips.</p>
        </div>
    </div>)
}
