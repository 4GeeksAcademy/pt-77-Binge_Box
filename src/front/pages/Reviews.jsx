import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReply, faStar } from "@fortawesome/free-solid-svg-icons";
import { Comments } from "../components/Comments.jsx";
import { ReviewBackground } from "../components/ReviewBackground.jsx";

export const Reviews = () => {
  const { store, dispatch, handle_getUser } = useGlobalReducer();
  const [userinfo, setUserInfo] = useState([])
  const { type, id } = useParams();
  const [liked, setLiked] = useState(false);
  const [itemType, setItemType] = useState("");
  const [itemId, setItemId] = useState("");
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({
    itemId: itemId,
    itemType: itemType,
    text: "",
    rating: 0,
  });

  useEffect(() => {
    handle_getUser();
    setUserInfo(handle_getUser);
  },[])

  // console.log(userinfo)


  useEffect(() => {
    if (type === "movie" || type === "series") {
      setItemType(type);
      setItemId(id);
      setReview((prev) => ({ ...prev, itemId: id, itemType: type }));
    }
  }, [type, id]);

  useEffect(() => {
    if (itemType && itemId) {
      const fetchReviews = async () => {
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/reviews/${itemType}/${itemId}`
        )
          .then((res) => res.json())
          .then((data) => setReviews(data));
      };
      fetchReviews();
    }
  }, [itemType, itemId]);

  const submitReview = async () => {
    const token = sessionStorage.getItem("access_token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/reviews/${itemType}/${itemId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ ...review, itemType: itemType, itemId: itemId }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Error submitting review:", err);
      return;
    }
    const data = await response.json();
    console.log("Review submitted:", data);
    setReviews((prev) => [data, ...prev]);
    setReview({ ...review, text: "" });
  };

  const toggleLiked = () => {
    setLiked(!liked);
    if (liked) {
      handleLiked();
    }
  };

  const handleLiked = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/favorites",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ favorites: review }),
        }
      );
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Failed to update favs", error);
    }
  };

  const handleDelete = () => {
    
  }

  return (
    <div className="text-start mt-5">
      <ReviewBackground itemType={itemType} itemId={itemId}></ReviewBackground>
      <div className="card text-bg-dark">
        <div className="card-header">Create a Review</div>
        <div className="card-body pt-0">
          <h5 className="card-title">
            <div className="rating mx-2 text-secondary">
              {[...Array(10)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={starValue}
                    onClick={() =>
                      setReview((prev) => ({ ...prev, rating: starValue }))
                    }
                    style={{
                      cursor: "pointer",
                      color: starValue <= review.rating ? "gold" : "",
                      fontSize: "2rem",
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                );
              })}
            </div>
          </h5>
          <textarea
            className="form-control"            
            placeholder="Leave a review..."
            value={review.text}
            onChange={(e) =>
              setReview({ ...review, text: e.target.value, itemType, itemId })
            }
          />          
        </div>
        <div className="card-footer text-body-light">
          <div className="d-flex ">
            <button
              type="submit"
              className="btn btn-success"
              onClick={() => submitReview()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      {reviews.map((review, index) => (
        <div key={review.id || index} className="card text-bg-dark mt-3">
            <div className="card-header">
              @cocoa_butter93
            </div>
            <div className="card-body pt-0">
              <div className="star-rating mb-2">
                {[...Array(10)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < review.rating ? "gold" : "gray",
                        fontSize: "1.5rem"
                      }}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </span>
                  ))}
              </div>
              <textarea
                className="form-control mt-2"
                value={review.text}
                readOnly
                >
              </textarea>
              <div className="d-flex align-items-center mt-3 ">
                <span
                  onClick={() => toggleLiked()}
                  style={{ color: liked ? "red" : "darkgray" }}
                  className="icon"
                >
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() =>
                    setExpandedReviewId(
                      expandedReviewId === review.id ? null : review.id
                    )
                  }
                >
                    <span 
                      className="mx-3"
                      style={{ color: "darkgray" }}>
                      <FontAwesomeIcon icon={faReply} />
                    </span>
                </button>

                <span 
                  className="delete"
                  onClick={() => handleDelete()}> ❌ 
                </span>

                {expandedReviewId === review.id && (
                  <div className="mt-3">
                    <Comments
                      reviewId={review.id}
                      itemType={itemType}
                      itemId={itemId}
                    />
                  </div>
                )}                
              </div>      
            </div>
          </div>
      ))}
      <div className="text-center m-5">
        {type === "movie" ? (
          <div>          
            <Link className="btn btn-dark mx-3" to={`/movieDetails/${itemId}`}>View Details</Link>
            <Link className="btn btn-dark mx-3" to={`/watchMovieTrailer/${itemId}`}>Watch Trailer</Link>
          </div>
        ) : (
          <div>
            <Link 
              className="btn btn-dark mx-3" 
              to={`/showDetails/1/${itemId}`}
              onClick={() => onShowClick(itemId, 1)}>
                View Episodes
            </Link>
            <Link className="btn btn-dark mx-3" to={`/watchTrailer/${itemId}`}>Watch Trailer</Link>
          </div>
        )} 
      </div>
    </div>
  );
};
