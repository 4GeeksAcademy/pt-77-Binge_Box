import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {

    const { store, dispatch, handle_login } = useGlobalReducer()
    const [user, setUser] = useState({email: "", password: ""})
    const navigate = useNavigate();
    
        const handleLogin = () => {
            handle_login(user)
            navigate("/")
        }           

    return (
        <div className="text-center mt-5 w-50 mx-auto">
            <div className="userlogin">                
                <div className="login input-group mb-3 border-dark">
                    <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                    <input 
                        type="email" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                </div>
                <div className="login input-group mb-3 border-dark">
                    <span className="input-group-text" id="inputGroup-sizing-default">Password</span>
                    <input 
                        type="password" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, password: e.target.value})}
                    />
                </div>            
            </div>
            <button                 
                type="button" 
                className="btn btn-primary border-dark m-4"
                onClick={() => handleLogin()}>Login</button>
        </div>
    );
}; 