import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const WatchTrailer = () => {
  const { store, dispatch } = useGlobalReducer();
  const [trailers, setTrailers] = useState([]);
  const[tvData, setTvData] = useState([]);

  const { series_id,} = useParams();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const getTrailer = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${series_id}?api_key=${API_KEY}&append_to_response=videos,images`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();
      setTvData(data);
      let actualTrailers = data.videos.results.filter(
        (video) => video.type == "Trailer"
      );
      console.log(actualTrailers);
      setTrailers(actualTrailers);
    };
    getTrailer();
  }, []);

  console.log(trailers);
  const videoUrl =
    trailers.length > 0
      ? `https://www.youtube.com/embed/${trailers[0].key}`
      : "";

  return (
    <div className="text-center mt-5">
      <div 
          className="cover"
          style={{
              height: "90vh",
              backgroundImage: `url("https://image.tmdb.org/t/p/w1280${tvData.backdrop_path}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",}}>
                
      </div>      
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
      <div className="buttons mt-3 ">
        <Link 
          className="btn btn-dark mx-3" 
          to={`/showDetails/1/${series_id}`}
          onClick={() => onShowClick(series_id, 1)}>
            View Episodes
        </Link>
        <Link className="btn btn-dark mx-3" to={`/reviews/series/${series_id}`}>Rate & Review</Link> 
        <div>
          <a href={tvData.homepage} className="card-link btn btn-dark mt-3">{tvData.homepage}</a>
        </div>                  
      </div>  
      <div className="d-flex m-5">
        <img 
          className="posterImage"
          src={`https://image.tmdb.org/t/p/w500${tvData.poster_path}`}
        />
        <div className="text-light p-3">
          <h1>{tvData.name}</h1>
          <p>{tvData.tagline}</p>
          <p>{tvData.overview}</p>
          <p>Release Date: {tvData.first_air_date}</p>
          <p>Rating: {tvData.rating}</p>
          <p>Seasons: {tvData.number_of_seasons}</p>
          <p>Episodes: {tvData.number_of_episodes}</p>
          {tvData.networks?.length > 0 && tvData.networks[0].logo_path && (
            <img
                src={`https://image.tmdb.org/t/p/w200${tvData.networks[0].logo_path}`}
                alt={tvData.networks[0].name}
            />
            )}
        </div>
      </div>
    </div>    
    
  );
};
