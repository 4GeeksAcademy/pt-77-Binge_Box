import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const MovieTailer = () => {
  const { store, dispatch } = useGlobalReducer();
  const [trailers, setTrailers] = useState([]);
  const [movieData, setMovieData] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const getMovieTrailer = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      setMovieData(data);
      let actualTrailers = data.videos.results.filter(
        (video) => video.type == "Trailer"
      );
      // console.log(actualTrailers);
      setTrailers(actualTrailers);
    };
    getMovieTrailer();
  }, [id]);

  // console.log(trailers);
  const videoUrl =
    trailers.length > 0
      ? `https://www.youtube.com/embed/${trailers[0].key}`
      : "";

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
      {videoUrl ? (
        <iframe
          className="Headers mt-5"
          width="560"
          height="315"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ):(
        <p>Trailer coming soon...</p>
      )}
      <div className="buttons mt-4">
        <Link className="btn btn-dark" to={`/movieDetails/${id}`}>View Details</Link>
        <Link className="btn btn-dark mx-2" to={`/reviews/movie/${id}`}>Rate & Review</Link>  
        <div>
            <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="card-link btn btn-dark mt-3">{movieData.homepage}</a>
        </div>                  
      </div>     
      <div className="d-flex m-5 ">
        <img className="posterImage"src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}/>
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
                  src={`https://image.tmdb.org/t/p/w200${movieData.production_companies[0].logo_path}`}
                  alt={movieData.production_companies[0].name}
              />
              )}                   
        </div>                 
      </div>   
    </div> 
    
  );
};
