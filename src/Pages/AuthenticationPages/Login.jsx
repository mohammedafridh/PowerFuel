import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../Context/Context';
import loadingGif from '../../assets/loading-gif.gif';
import './authentication.css'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const { logIn } = useUserAuth();
    const navigate = useNavigate()

    const loginHandler = async (e) => {
        e.preventDefault();
        setError('')
        try {
            setLoading(true);
            await logIn(email, password)
            toast.success("Logged In")
            setLoading(false);
            navigate('/home')
        } catch (err) {
            setLoading(false);
            console.log("error", err);
            setError("Invalid Credentials");
        }
    }

    return (
        <div className="login">
            <div className="authForm">
                <form onSubmit={loginHandler} className="loginForm">
                    <h2>Power Fuel Login</h2>

                    <div className='authInput'>
                        <div>
                            <input
                                type="text"
                                className='loginInput'
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                                value={email}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                className='loginInput'
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                value={password}
                                required
                            />
                        </div>

                        <div className='errorText'>{error}</div>

                        <p className="regText">Do not have an Account? <Link to='/register'>Register</Link></p>
                    </div>

                    {
                        loading ?
                            <button type='submit' className='button btn'>
                                <img className='loading-gif' src={loadingGif} />
                            </button>
                            :
                            <button type='submit' className='button btn'>
                                Login
                            </button>
                    }

                </form>
            </div>
        </div>
    )
}

export default Login