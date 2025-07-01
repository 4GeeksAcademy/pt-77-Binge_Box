import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Signup = () => {

    const { store, dispatch, handle_signup } = useGlobalReducer()
    const [user, setUser] = useState({first_name: "", last_name: "", email: "", password: ""})
    const navigate = useNavigate();

    const handleSignup = () => {
        handle_signup(user)
        navigate("/login")
    }        

    return (
        <div className="text-center mt-5 w-50 mx-auto">
            <div className="userInfo">
                <div className="signup input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">First Name</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, first_name: e.target.value})}
                    />
                </div>
                <div className="signup input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Last Name</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, last_name: e.target.value})}
                    />
                </div>
                <div className="signup input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                    <input 
                        type="email" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                </div>
                <div className="signup input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">User Name</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        aria-label="Sizing example input" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e) => setUser({...user, user_name: e.target.value})}
                    />
                </div>
                <div className="signup input-group mb-3">
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
                onClick={() => handleSignup()}>Create Account</button>
        </div>
    );
}; 