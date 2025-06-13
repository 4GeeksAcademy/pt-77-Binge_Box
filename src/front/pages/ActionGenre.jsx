import React, { useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ShowCard } from "../components/ShowCard.jsx";
import { MovieCard } from "../components/MovieCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const ActionGenre = () => {

    const { store, dispatch, getShows, getTopRated, getPopularMovies, getTopRatedMovies } = useGlobalReducer()  
    const navigate = useNavigate();
    const actionGenreId = 28; // Action & Adventure movies
    const actionTvId = 10759; // Action & Adventure tv
    const [genres, setGenres] = useState([]);    
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]); 
    const [selectedShow, setSelectedShow] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const[actionMovies, setActionMovies] = useState([]);
    const[actionShows, setActionShows] = useState([]);
    
    useEffect(() => {
        getShows();
        getTopRated();
        getPopularMovies();
        getTopRatedMovies();
    }, [])

    useEffect(() => {
        setShows(store.shows, store.showsTopRated);
        setMovies(store.popularMovies, store.topRatedMovies);
    }, [
        store.shows, 
        store.showsTopRated, 
        store.popularMovies, 
        store.topRatedMovies
    ])   

   
    return (
        <div className="text-center mt-5">
            <h2 className="Headers text-bg-dark mt-5 p-2">Action Films</h2>
            <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
                {Array.isArray(movies) && movies.length > 0 ? (
                    movies                   
                        .filter((movie) => movie.genre_ids.includes(actionGenreId))
                        .map((movie, index) => (
                            <MovieCard
                                key={index}
                                id={movie.id}
                                original_title={movie.original_title}
                                poster_path={movie.poster_path}
                                name={movie.name}
                                overview={movie.overview}
                                vote_average={movie.vote_average}
                                release_date={movie.release_date}
                                onClick={() => setSelectedMovie({ id })}
                            />
                        ))
                ) : (
                    <p>No action movies found.</p>
                )}           
            </div>

            <h2 className="Headers text-bg-dark mt-5 p-2">Action TV</h2>
            <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
                {Array.isArray(actionShows) && actionShows.length > 0 ? (
                actionShows
                    .filter((show) => show.genre_ids.includes(actionTvId))
                    .map((show, index) => (
                    <ShowCard
                        key={index}
                        id={show.id}
                        poster_path={show.poster_path}
                        first_air_date={show.first_air_date}
                        name={show.name}
                        overview={show.overview}
                        vote_average={show.vote_average}
                        first_air_date={show.first_air_date}
                        onClick={() => setSelectedShow({ id })}
                    />
                    ))
                ) : (
                <p>No shows found.</p>
                )}
            </div>
        </div>
    );
}; 