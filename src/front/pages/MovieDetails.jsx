import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const MovieDetails = () => {

    const { store, dispatch } = useGlobalReducer();
    const [movieData, setMovieData] = useState("");
    const {id} = useParams();

    useEffect(() => {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const getMovie = async() => {
            let response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();            
            if(!response.ok){
                console.log("movie failed to load");
                return;                
            }            
            setMovieData(data);
        }
        getMovie();
    }, [id])    

    return (
        <div className="text-center mt-5">
            <div className="cover"
                style={{
                    height: "90vh",
                    backgroundImage: `url("https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}>
            </div>
            <div className="d-flex m-5 ">
                <img className="posterImage" src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}/>
                <div className="text-light p-3">
                    <h1>{movieData.title}</h1> 
                    <p>{movieData.tagline}</p>                                                         
                    <p>{movieData.overview}</p>
                    <p>Release Date: {movieData.release_date}</p> 
                    <p>Rating: {movieData.vote_average}</p> 
                    <p>Runtime: {movieData.runtime}</p>
                    <p>Origin Country: {movieData.origin_country}</p>                   
                    {movieData.production_companies?.length > 0 && movieData.production_companies[0].logo_path && (
                        <img
                            className="mb-2"
                            src={`https://image.tmdb.org/t/p/w200${movieData.production_companies[0].logo_path}`}
                            alt={movieData.production_companies[0].name}
                        />
                        )}
                    <div className="buttons mt-4">
                        <Link className="btn btn-dark" to={`/watchMovieTrailer/${id}`}>Watch Trailer</Link>
                        <Link className="btn btn-dark mx-2" to={`/reviews/movie/${id}`}>Rate & Review</Link>
                        <div>
                            <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="card-link btn btn-dark mt-3">{movieData.homepage}</a>
                        </div>
                    </div>              
                </div>                 
            </div>
            
        </div>
    );    
}; 