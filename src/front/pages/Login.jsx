import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {

    const { store, dispatch, handle_login } = useGlobalReducer()
    const [user, setUser] = useState({email: "", password: ""})
    const [changePassword, setChangePassword] = useState(false)
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    
    const handleLogin = () => {
        handle_login(user)
        navigate("/profile")
    }
    
    const newPasswordEmail = async() => {
        let tempPassword = await fetch(`${import.meta.env.VITE_BACKEND_URL}/request-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
        });
    }

    const resetPassword = () => {

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
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary border-dark m-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Forgot Password
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Reset Password</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="text-start mb-3">
                        <label for="exampleFormControlInput1" className="form-label">User Email</label>
                        <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
                        <p className="py-2" style={{color: "gray"}}>We will send a temporary password to the User Email for password reset</p>
                    </div>
                    {/* <div className="text-start">
                        <label for="inputPassword5" className="form-label">New Password</label>
                        <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock"/>
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>                     */}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Send Code</button>
                </div>
                </div>
            </div>
            </div>
            <button                 
                type="button" 
                className="btn btn-primary border-dark m-4"
                onClick={() => handleLogin()}>
                    Login
            </button>
        </div>
    );
}; 