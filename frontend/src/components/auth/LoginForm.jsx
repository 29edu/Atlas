import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

export default function LoginForm() {
    const [email , setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);

    const navigate = useNavigate();
 
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {email, password};
            const response = await fetch('http://localhost:5082/login', {
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseFromServer = await response.json();
            const success = responseFromServer.success;

            if(success) {
                toast.success('LoginSucessful')
                console.log('Data submitted to the server');
                // navigate('/dashboard');
                
            } else {
                toast.error('Failed to login');
            }

        } catch (error) {
            console.log('Found some error in login', error.message);
        }
    }

    return (
        <>
            <h1>Login</h1>
            <div>
                <form className="" onSubmit={handleSubmit} method="POST">
                    <label htmlFor="email">Email </label>
                    <input 
                        id="email" 
                        type="email" 
                        autoComplete="off"
                        value={email}
                        placeholder="Enter Your login" 
                        onChange={handleEmailChange}
                        className=""
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        autoComplete="new-password"
                        placeholder="Enter Your password"
                        onChange={handlePasswordChange}
                        className=""
                    />
                    
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}