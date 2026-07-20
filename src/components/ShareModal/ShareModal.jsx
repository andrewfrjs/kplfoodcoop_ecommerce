import { useEffect } from 'react';
import { FaFacebook, FaCopy, FaLinkedin, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { FaXmark, FaXTwitter } from 'react-icons/fa6';
import { FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import './ShareModal.scss';

export default function ShareModal({ visible, setVisible, url, title }) {
  useEffect(() => {
    const onScroll = () => { if (visible) setVisible(false); };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [visible, setVisible]);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '/');
  const shareTitle = title || 'Check this out on KPL FoodCoop!';

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
  };

  return (
    <div className="share-modal" onClick={(e) => e.stopPropagation()}>
      <div className="content-share">
        <p><span>Share this link</span> <FaXmark className="close" onClick={() => setVisible(false)} /></p>
        <ul className="icons">
          <li className="facebook"><FacebookShareButton quote={shareTitle} url={shareUrl} hashtag="food"><FaFacebook /></FacebookShareButton></li>
          <li className="twitter"><TwitterShareButton url={shareUrl} title={shareTitle}><FaXTwitter /></TwitterShareButton></li>
          <li className="whatsapp"><WhatsappShareButton url={shareUrl} title={shareTitle}><FaWhatsapp /></WhatsappShareButton></li>
          <li className="telegram"><TelegramShareButton url={shareUrl} title={shareTitle}><FaTelegram /></TelegramShareButton></li>
          <li className="linkedin"><LinkedinShareButton url={shareUrl} title={shareTitle}><FaLinkedin /></LinkedinShareButton></li>
        </ul>
        <div className="field">
          <input type="text" value={shareUrl} readOnly />
          <button onClick={copyLink}><FaCopy /></button>
        </div>
      </div>
    </div>
  );
}
