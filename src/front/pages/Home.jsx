import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Private } from "./Private.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ShowCard } from "../components/ShowCard.jsx";
import { MovieCard } from "../components/MovieCard.jsx";
import { Carousel } from "../components/Carousel.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
  const {
    store,
    dispatch,
    getShows,
    getAiringToday,
    getTopRated,
    getTrending,
    getGenres,
    getPopularMovies,
    getTopRatedMovies,
    getMoviesPlayingNow,
    getUpcomingMovies,
    getTrendingMovies,
  } = useGlobalReducer();
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = [];
  const [selectedMovie, setSelectedMovie] = [];
  const [shows, setShows] = useState([]);
  const [airingToday, setAiringToday] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [action, setAction] = useState([]);
  const [moviesPlayingNow, setMoviesPlayingNow] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [animmation, setAnimation] = useState([]);
  const [drama, setDrama] = useState([]);
  const [Comedy, setComedy] = useState([]);
  const [crime, setCrime] = useState([]);
  const [family, setFamily] = useState([]);
  const [sciFi, setSciFi] = useState([]);
  const [soap, setSoap] = useState([]);
  const [other, setOther] = useState([]);

  useEffect(() => {
    getShows();
    getAiringToday();
    getTopRated();
    getTrending();
    getPopularMovies();
    getTopRatedMovies();
    getMoviesPlayingNow();
    getUpcomingMovies();
    getTrendingMovies();
    getGenres().then((data) => {
      setGenres(data.genres);
    });
  }, []); 

  useEffect(() => {
    setShows(store.shows);
    setAiringToday(store.showsAiringToday);
    setTopRated(store.showsTopRated);
    setTrending(store.showsTrending);
    setPopularMovies(store.popularMovies);
    setMoviesPlayingNow(store.moviesPlayingNow);
    setTopRatedMovies(store.topRatedMovies);
    setTrendingMovies(store.trendingMovies);
  }, [
    store.shows,
    store.showsAiringToday,
    store.showsTopRated,
    store.showsTrending,
    store.popularMovies,
    store.moviesPlayingNow,
    store.topRatedMovies,
    store.trendingMovies,
  ]);
  
  const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        dispatch({
            type: "set_user",
            payload: { user: null, access_token: null },
        });
        navigate("/login");
    }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
  }

  // console.log(shows, airingToday, topRated, "HERE");

  return (
    <div className="text-center mt-5">
      <Carousel />
      <h2 className=" Headers text-bg-dark mt-5 p-2">Top Rated Films</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(topRatedMovies) && topRatedMovies.length > 0 ? (
          topRatedMovies
            .slice(0, 15)
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
          <p>No movies found.</p>
        )}
      </div>

      <h2 className="Headers text-bg-dark mt-5 p-2">Trending Films</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(trendingMovies) && trendingMovies.length > 0 ? (
          trendingMovies
            .slice(0, 15)
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
          <p>No movies found.</p>
        )}
      </div>

      <h2 className=" Headers text-bg-dark mt-5 p-2">Popular Films</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(popularMovies) && popularMovies.length > 0 ? (
          popularMovies
            .slice(0, 15)
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
          <p>No movies found.</p>
        )}
      </div>

      <h2 className=" Headers text-bg-dark mt-5 p-2">Films Playing Now</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(moviesPlayingNow) && moviesPlayingNow.length > 0 ? (
          moviesPlayingNow
            .slice(0, 15)
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
          <p>No movies found.</p>
        )}
      </div>

      <h2 className=" Headers text-bg-dark mt-5 p-2">Top Rated</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(topRated) && topRated.length > 0 ? (
          topRated
            .slice(0, 15)
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

      <h2 className=" Headers text-bg-dark mt-5 p-2">Trending TV</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(trending) && trending.length > 0 ? (
          trending
            .slice(0, 15)
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

      <h2 className=" Headers text-bg-dark mt-5 p-2">Popular TV</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(shows) && shows.length > 0 ? (
          shows
            .slice(0, 15)
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

      <h2 className=" Headers text-bg-dark mt-5 p-2">Airing Today</h2>
      <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto ">
        {Array.isArray(airingToday) && airingToday.length > 0 ? (
          airingToday
            .slice(0, 15)
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
      
      <div className=" Headers d-flex justify-content-center text-bg-dark my-5 p-2">
         <Link className="btn btn-outline-primary mx-2" to={"/profile"}>View Profile</Link>
         <button 
            className="btn btn-outline-primary mx-3" 
            onClick={scrollToTop}>Back to Top
         </button>
         <button 
            className="btn btn-outline-primary mx-3"
            onClick={handleLogout}  
            to={"/profile"}>Logout
          </button>

          
      </div>
     
      <div className="alert alert-info">
        {store.message ? (
          <span>{store.message}</span>
        ) : (
          <span className="text-danger">
            {/* Loading message from the backend (make sure your python 🐍 backend
            is running)... */}
          </span>
        )}
      </div>      
    </div>
  );
};
