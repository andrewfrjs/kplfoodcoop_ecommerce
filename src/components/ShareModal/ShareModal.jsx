import React, { useEffect } from 'react';
import { FaCopy, FaFacebook, FaLink, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import "./ShareModal.scss"
import { FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';


export default function ShareModal({visible, setVisible}) {
  useEffect(() => {
    document.onscroll = () => {
      if(visible){
        setVisible(false);
      }
    }
  }, []);
  return (
    <div className='share-modal'>
        <div className="content-share">
            <p><span>Share this link via</span> <FaXmark className='close' onClick={() => setVisible(!visible)}/></p>
            <ul className="icons">
                <a className='facebook'>
                  <FacebookShareButton   quote={'Dummy text!'} url='/' description={"aiueo"} hashtag='food'><FaFacebook/></FacebookShareButton>  </a>
                <a className='twitter' ><TwitterShareButton url='Example.Com/Share-Link' title='lorem ipsum dolo sit amet.'  hashtags={["test-tag", "test-tag-again"]} ><FaTwitter/></TwitterShareButton></a>
                <a className='whatsapp'><WhatsappShareButton url='nutricon.com' title=""><FaWhatsapp /></WhatsappShareButton></a>
                <a className='telegram'><TelegramShareButton url='/' content='/' title='Lorem ipsum'><FaTelegram/></TelegramShareButton></a>
                <a className='linkedin'><LinkedinShareButton url='/' title="Title here" summary='description here' source='nutricon.com'><FaLinkedin /></LinkedinShareButton></a>
            </ul>
            <p>Or Copy Link</p>
            <div className="field">
                <FaLink className='link-class'/>
                <input type="text" value='example.com/share-link'/>
                <button><FaCopy/></button>
            </div>
        </div>

    </div>
  );
}