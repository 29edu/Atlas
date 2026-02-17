import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // check if token exist on app 
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if(savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }

        setLoading(true);
    }, []);

    //login function
    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5082/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if(data.success) {
                setToken(data.data.token);
                setUser(data.data.user);
                setIsAuthenticated(true);

                // save to local storage
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));

                return {
                    success: true
                }
            } else {
                return {
                    success: false,
                    message: data.message
                }
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    //logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, user, token, loading, login, logout}}>{children}</AuthContext.Provider>
    )
}