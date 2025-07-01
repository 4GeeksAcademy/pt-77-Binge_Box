import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useParams, Link } from "react-router-dom";
import { EpisodeCard } from '../components/EpisodeCard.jsx';



export const ShowDetails = () => {
    const { store, dispatch } = useGlobalReducer();
    const [allSeasonsData, setAllSeasonsData] = useState([]);
    const[seriesData, setSeriesData] = useState([]);
    const [episode, setEpisode] = useState([]);
    const [seasonImages, setSeasonImages] = useState([]);
    const [seasonVideos, setSeasonVideos] = useState([]);

    const { series_id, season_numbers } = useParams();

     useEffect(() => {
        const fetchAllSeasons = async () => {
            if (!series_id) return;

            const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

            let seasonNums = [];
            if (!season_numbers) {
                // Fetch show details to get all season numbers
                const showResp = await fetch(`https://api.themoviedb.org/3/tv/${series_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + API_KEY,
                        "Content-Type": "application/json"
                    },
                });
                const showData = await showResp.json();
                if (!showResp.ok) {
                    console.log("Could not load show data");
                    return;
                }
                setSeriesData(showData);
                seasonNums = showData.seasons
                    .filter(s => s.season_number > 0)
                    .map(s => s.season_number);
            } else {
                seasonNums = season_numbers.split(',').map(num => num.trim());
            }

            // Fetch each season(.map(num) splits the string into an array of season numbers.)
            const seasonPromises = seasonNums.map(async (num) => {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${series_id}/season/${num}?append_to_response=videos,images`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + API_KEY,
                        "Content-Type": "application/json"
                    },
                });
                if (!response.ok) return null;
                return response.json();
            });

            const seasonResults = await Promise.all(seasonPromises);
            setAllSeasonsData(seasonResults.filter(Boolean)); //filters out failed seasons
        };

        fetchAllSeasons();
    }, [series_id, season_numbers]);

    // console.log(seasonImages[0], seasonVideos);

    return (
        <div className="text-center mt-5">
            <div 
                className="cover"
                style={{
                    height: "90vh",
                    backgroundImage: `url("https://image.tmdb.org/t/p/w1280${seriesData.backdrop_path}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",}}>
            </div>            
            <div className="d-flex m-5">
                <img 
                    className="posterImage" 
                    src={`https://image.tmdb.org/t/p/w500${seriesData.poster_path}`}
                />
                <div className="text-light p-3">
                    <h1>{seriesData.name}</h1>
                    <p>seriesData.tagline</p>
                    <p>{seriesData.overview}</p>
                    <p>Release Date: {seriesData.first_air_date}</p>
                    <p>Rating: {seriesData.vote_average}</p>
                    <p>Seasons: {seriesData.number_of_seasons}</p>
                    <p>Episodes: {seriesData.number_of_episodes}</p>                    
                    {seriesData.networks?.length > 0 && seriesData.networks[0].logo_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w200${seriesData.networks[0].logo_path}`}
                            alt={seriesData.networks[0].name}
                        />
                        )}                
                    <div className="buttons mt-3 ">
                        <Link className="btn btn-dark mx-3" to={`/watchTrailer/${series_id}`}>Watch Trailer</Link>
                        <Link className="btn btn-dark mx-3" to={`/reviews/series/${series_id}`}>Rate & Review</Link> 
                        <div>
                            <a 
                                href={seriesData.homepage} 
                                target="_blank" rel="noopener noreferrer" 
                                className="card-link btn btn-dark mt-3">
                                    {seriesData.homepage}
                            </a> 
                        </div>                   
                    </div>
                </div>  
            </div>
            {allSeasonsData.length === 0 ? (
                <p>Loading seasons...</p>
            ) : (
                allSeasonsData.map((season, idx) => (
                    <div key={season.id || idx}>                        
                        <h2 className="Headers text-bg-dark mt-5 p-2">Season: {season.season_number}</h2>
                        <div className="d-flex align-items-stretch col-10 overflow-auto mt-2 mx-auto">
                            {Array.isArray(season.episodes) && season.episodes.length > 0 ? (
                                season.episodes.map((episode, index) => (
                                    <EpisodeCard
                                        key={episode.id}
                                        id={episode.id}
                                        episode_number={episode.episode_number}
                                        air_date={episode.air_date}
                                        name={episode.name}
                                        overview={episode.overview}
                                        guest_stars={episode.guest_stars}
                                        runtime={episode.runtime}
                                        poster={
                                            episode.still_path
                                            ? "https://image.tmdb.org/t/p/w500" + episode.still_path
                                            : season.poster_path
                                                ? "https://image.tmdb.org/t/p/w500" + season.poster_path
                                                : "https://static.vecteezy.com/system/resources/thumbnails/000/429/651/small/1312.i011.022.S.i011.c10.COMING_SOON.jpg"
                                        }
                                    />
                                ))
                            ) : (
                                <p className="mt-3">More episodes comming soon!</p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};