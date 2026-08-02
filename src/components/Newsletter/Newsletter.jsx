import { useState, useEffect } from 'react';
import "./Newsletter.scss"
import { FaShare } from 'react-icons/fa';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        setTimeout(() => {
            error && setError(null);
            success && setSuccess(null);
        }, 2000);
    }, [success, error]); 
    return (
        <section className='newsletter' id='subscribe'>
            <h2>Subscribe to our email List</h2>
            <p>Subscribe Now</p>
            <form onSubmit={handleSubmit}>
                <input type='email' name='email' placeholder='example@gmail.com' title='enter email' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                <button type='submit' className='btn' title='submit'><FaShare /></button>
            </form>
            {error && <p className='error'>{error}!</p>}
            {success && <p className='success'>Thank You For Subscribing!</p>}
        </section>
    );
}

export default Newsletter;
