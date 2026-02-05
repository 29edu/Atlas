import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

export default function SignUpForm() {
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(!firstName || !secondName || !email || !password || !confirmPassword) {
                toast.warning('Please Enter all the details before procedding')
                console.log("Please Enter All the details")
            }

            if(password!==confirmPassword ) {
                toast.warning("Password doesn't match");
                console.log('Password donot match');
                return;
            }

            const response = await axios.post('http://localhost:5082/signup', {
                firstName: firstName,
                secondName: secondName,
                email : email,
                password: password
            })

            if(response.data.success){
                console.log('Sign up successful')
                toast.success('Sign Up successful');
                // navigate('/dashboard');

            } else {
                toast.error('Sign up failed');
                console.log('Failed to receive data in signup');

            }

        } catch (error) {
            toast.error(error.message);
            console.error('Error found in Register Form', error)
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">First Name</label>
                    <input
                        id="first"
                        name="first"
                        type="text"
                        value={firstName}
                        autoComplete="off"
                        onChange={(e) => setFirstName(e.target.value)}
                        className=""
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        value={email}
                        type="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        className=""
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        value={password}
                        type="password"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        className=""
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        type="confirmPassword"
                        autoComplete="off"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className=""
                    />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </>
    )
}