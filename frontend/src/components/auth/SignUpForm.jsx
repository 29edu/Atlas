import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState([]);

    const handleSubmit = (e) => {
        
        
    }
}