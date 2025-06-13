import React, { useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ShowCard } from "../components/ShowCard.jsx";
import { MovieCard } from "../components/MovieCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Live = () => {

    const { store, dispatch, getAiringToday, getMoviesPlayingNow} = useGlobalReducer()  
    const navigate = useNavigate();
    // const liveGenreId = 35 ; // Live movies
    // const liveTvId = 35 ; // Live tv
    const [genres, setGenres] = useState([]);    
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]); 
    const [selectedShow, setSelectedShow] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const[liveMovies, setLiveMovies] = useState([]);
    const[liveShows, setLiveShows] = useState([]);

   useEffect(() => {
        getAiringToday();
        getMoviesPlayingNow();
        
    }, [])

    useEffect(() => {
        setShows(store.showsAiringToday);
        setMovies(store.moviesPlayingNow);
    }, [
        store.showsAiringToday, 
        store.moviesPlayingNow
    ])     
           

    return (
        <div className="text-center mt-5">
            <h2 className="Headers text-bg-dark mt-5 p-2">Films Playing Now</h2>
            <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
                {Array.isArray(movies) && movies.length > 0 ? (
                    movies                   
                        // .filter((movie) => movie.genre_ids.includes(liveGenreId))
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
                    <p>No live movies found.</p>
                )}           
            </div>

            <h2 className="Headers text-bg-dark mt-5 p-2">Shows Airing Today</h2>
            <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
                {Array.isArray(shows) && shows.length > 0 ? (
                shows
                    // .filter((show) => show.genre_ids.includes(liveTvId))
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
                <p>No live shows found.</p>
                )}
            </div>
            
        </div>
    );
}; 