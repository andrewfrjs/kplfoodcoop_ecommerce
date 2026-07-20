import { useState } from 'react';
import './Faq.scss';
import { FaChevronDown } from 'react-icons/fa';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Orders within Nairobi are delivered same-day when placed before 2 PM. Outer regions receive next-day delivery.' },
  { q: 'What are your delivery fees?', a: 'Delivery is free for orders above KSH 3,000. Below that, a flat KSH 200 fee applies.' },
  { q: 'How do I pay for my order?', a: 'You can pay cash on delivery, or via M-Pesa on checkout. Card and online payments are coming soon.' },
  { q: 'Can I return spoiled produce?', a: 'Yes. If your produce arrives damaged or spoiled, contact us within 24 hours for a free replacement or refund.' },
];

export default function Faq() {
  const [active, setActive] = useState(0);
  return (
    <div className="faqs">
      {FAQS.map((f, i) => (
        <div key={i} className={`faq ${active === i ? 'active' : ''}`} onClick={() => setActive(active === i ? -1 : i)}>
          <div className="faq-head">
            <h3>{f.q}</h3>
            <FaChevronDown className="chev" />
          </div>
          {active === i && <p>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
