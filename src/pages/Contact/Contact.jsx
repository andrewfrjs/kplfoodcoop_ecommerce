import { useState, useEffect } from 'react';
import { addContact } from '../../../firebase';  // Importing the function to add contact message to Firestore
import './Contact.scss';
import ThanksModal from '../../components/ThanksModal/ThanksModal';

const Contact = () => {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [Message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Name && Email && Message) {
            try {
                // Call the function to add the contact message to Firestore
                await addContact({ Name, Email, Phone, Message }, setToast, setError);
                setSuccess("Your message was submitted successfully!");
            } catch (err) {
                setError("There was an error submitting your message. Please try again.");
            }
        } else {
            setError("All fields are required.");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            error && setError(null);
            success && setSuccess(null);
        }, 2000);
    }, [success, error]);

    return (
        <div className='contact'>
            {toast && <ThanksModal title={"Thank you!"} text={toast} runFunction={setToast}/>}
            <form onSubmit={handleSubmit}>
                <h1>GET IN TOUCH</h1>
                <input
                    type="text"
                    id='name'
                    placeholder='Your Name'
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    id='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='tel'
                    id='phone'
                    placeholder='Phone Number'
                    onChange={(e) => setPhone(e.target.value)}
                />
                <textarea
                    id="message"
                    rows="4"
                    placeholder='How can we help you?'
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></textarea>
                <button className='btn' type='submit' title='submit'>Send</button>
                {
                    error && <p className='error'>{error}!</p>
                }
                {
                    success && <p className='success'>{success}</p>
                }
            </form>
        </div>
    );
}

export default Contact;
