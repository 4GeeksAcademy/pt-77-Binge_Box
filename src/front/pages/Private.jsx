import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import { ShowCard } from "../components/ShowCard.jsx";
import { MovieCard } from "../components/MovieCard.jsx";

export const Private = () => {

    const { store, dispatch, handle_getUser } = useGlobalReducer()
    const [message, setMessage] = useState("")  
    const [bio, setBio] = useState("")
    const [editBio, setEditBio] = useState(false)
    const [image, setImage] = useState(null)
    const [savedImage, setSavedImage] = useState(false)
    const[favorites, setFavorites] = useState([]);  
    const [watchList, setWatchList] = useState([]);    
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if(token && !store.user) {
            handle_getUser(token)
        }
    }, [store.access_token])
    
    useEffect(() => {
        if(store?.user == null){
            setMessage("YOU MUST LOGIN FIRST")
        }else{
            setMessage(`Hello ${store.user.first_name}`)
            setBio(store.user.bio || "")
        }
    }, [store.user])

    const handleBio = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/update_bio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({user_bio: bio})
            });
            const data = await response.json();                       
            setEditBio(false);
            console.log(data.message);
        } catch (error) {
            console.error("Failed to update bio")
        }       
    };

    const handleImage = async () => {
        if(!image) return;
        const formData = new FormData();
        formData.append('user_image', image);
        
        const token = sessionStorage.getItem('access_token');
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/update_image', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData,
        });
        if (response.ok) {
            setSavedImage(true);
        }
    };

     useEffect(() => {
        const fetchBio = async() => {
            const token = sessionStorage.getItem('access_token');
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/get_bio', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                setBio(data.user_bio);
            }
            fetchBio();

        const fetchImage = async() => {
            const token = sessionStorage.getItem('access_token');
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/get_image', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                setBio(data.user_image);
            }
            fetchImage();

            const fetchlikes = async() => {
            const token = sessionStorage.getItem('access_token');
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/user/favorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                setFavorites(data);
            }
            fetchlikes();

            const fetchWatchList = async() => {
            const token = sessionStorage.getItem('access_token');
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/user/favorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                setWatchList(data);
            }
            fetchWatchList();
    }, []);


    const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        dispatch({
            type: "set_user",
            payload: { user: null, access_token: null },
        });
        navigate("/login");
    }

    return (
        <div className="text-center my-5">
            <div className="containter-fluid my-5">
                <div className="profileCard card border-2 rounded border-dark mx-2 pb-5">
                    <div className="card-header border-2 rounded border-dark">
                        <h5>{message}</h5>                        
                    </div>
                    <div className="card-body border-2 rounded border-dark">
                        <div className="d-flex align-items-center">
                            <div className="border-2 rounded border-dark d-flex flex-column col-4 mb-2">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSllHYt7njYkqDfNdEBcNHiNkOwov2NXCnC6Q&s" 
                                    className="img-thumbnail border-2 rounded border-dark mx-2" 
                                    alt="..."/> 
                                {/* <!-- Button trigger modal --> */}
                                <button type="button" className="btn btn-primary btn-outline-dark p-2 mt-3 w-50 mx-auto" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Upload Photo
                                </button>

                                {/* <!-- Modal --> */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Upload Photo</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="d-flex justify-content-around">
                                                    <div className="input-group mb-3">
                                                        <input 
                                                            type="file" 
                                                            className="form-control" 
                                                            id="inputGroupFile02"
                                                            onChange={(e) => setImage(e.target.files[0])}/>
                                                        <label 
                                                            className="input-group-text" 
                                                            htmlFor="inputGroupFile02">
                                                                Upload Photo
                                                        </label>
                                                    </div>
                                                </div>                                                                            
                                            </div>
                                            <div className="modal-footer">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary" 
                                                    data-bs-dismiss="modal">
                                                        Cancel
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-primary btn-outline-dark"
                                                    onClick={handleImage}>Save Photo</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column col-6 mx-3">
                                {store.user? 
                                    <div className="text-start mb-1">                                    
                                        <p>{store.user.first_name + " " + store.user.last_name}</p>
                                        <p>{store.user.user_name}</p>
                                        <p>{store.user.email}</p>
                                    </div>
                                    : null}
                                <label htmlFor="input" className="mb-2">Bio:</label>
                                <div>                                
                                    <textarea 
                                        className="border-2 rounded border-dark rounded w-100"
                                        type="text"
                                        rows="10"
                                        value={bio}
                                        placeholder=" Write something about yourself..."
                                        onChange={(e) => setBio(e.target.value)}
                                        readOnly={!editBio}
                                    />
                                    {editBio ? (
                                        <button className="btn btn-primary btn-outline-dark w-50 mx-auto mt-3 p-2" onClick={handleBio}>Save Bio</button>
                                    ) : (
                                        <button className="btn btn-primary btn-outline-dark w-50 mx-auto mt-3 p-2" onClick={() => setEditBio(true)}>Edit Bio</button>
                                    )}
                                </div>
                            </div>                                              
                        </div>                                                   
                    </div>
                </div>                              
            </div> 
            <button
                onClick={handleLogout} 
                className="btn btn-danger m-3 mx-center">
                    Log Out
            </button>           
        </div>
    );
}; 