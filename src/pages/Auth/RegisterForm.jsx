import { useEffect, useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { createUser } from '../../../firebase';  // Importing the createUser function from Firebase
import './Auth.scss';

const RegisterForm = ({ user }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        if (email && password) {
            if (email.match(mailformat)) {
                if (password.match(passw)) {
                    // Calling the createUser function from Firebase
                    const { error, message } = await createUser(username, email, password, setSuccess, setError);
                    if (error) {
                        setError(message);
                    } else {
                        setSuccess(message);
                        window.history.back();  // Redirect to the previous page after successful registration
                    }
                } else {
                    setError('Wrong password format!');
                    return;
                }
            } else {
                setError('You have entered an invalid email address!');
                return;
            }
        } else {
            setError('Enter email and password');
            return;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            error && setError(null);
            success && setSuccess(null);
        }, 2000);
    }, [success, error]);

    return (
        <div className='auth'>
            {user && (
                <Navigate to="/profile" replace={true} />
            )}
            <form onSubmit={handleRegister}>
                <h1>Get Started</h1>
                <input
                    type="text"
                    id='username'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    id='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id='repeat-password'
                    placeholder='Repeat Password'
                    required
                />
                <button className='btn' type='submit' title='submit'>Register</button>
                {
                    error && <p className='error'>{error}!</p>
                }
                {
                    success && <p className='success'>{success}</p>
                }
                <p>Already have an account? <NavLink to={"/login"}>Login</NavLink></p>
            </form>
        </div>
    );
};

export default RegisterForm;
