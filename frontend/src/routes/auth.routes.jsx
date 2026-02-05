
import LoginForm from "../components/auth/LoginForm";
import { Route, Routes } from "react-router-dom";
import SignUpForm from "../components/auth/SignUpForm";

function AuthRoutes() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
            </Routes>
        </>
    )
}

export {
    AuthRoutes
}