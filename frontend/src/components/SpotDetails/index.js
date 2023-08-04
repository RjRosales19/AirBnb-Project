import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { getSingleSpot } from "../../store/spots";
import './SpotDetails.css'
import { getSpotReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReviewFormModal from "../ManageSpots/CreateReviewFormModal";
import DeleteReviewModal from "../ManageSpots/DeleteReviewModal"
const SpotDetails = () =>{
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    const reviews = Object.values(useSelector((state) => state.reviews.singleSpot))
    // console.log("***************", reviews.map(review => review))
    // console.log("||||||||||", spot)
    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
    },[dispatch, spotId])

    useEffect(()=>{
        dispatch(getSpotReviews(spotId))
    },[dispatch, spotId])

    if(!spot.id || !spot.Owner) return null


    const allSpotImages = spot.SpotImages.filter(image => image.preview === false)

    return (
    <div>
        <div>
            <h2>{spot.name}</h2>
            <p> {spot.city}, {spot.state}, {spot.country}</p>
        </div>
        <div className='spotimages-container'>
            <div className='largeImg-container'>
            <img src={spot.SpotImages[0].url} alt={`${spot.name}`}></img>
            </div>
                    {allSpotImages.map(image =><div className="smallImg-container"> <img key={image.id} src={image.url} alt={spot.name}></img></div>)}
        </div>
        <div>
            <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
            <h3>{spot.description}</h3>
        </div>
            <div>
                <h2>${spot.price} night</h2>
                <p>{spot.numReviews}</p>
                <p>{spot.avgStarRating}</p>
            </div>
        <section>
                    <h2>
                        <p><i className="fa fa-star"></i>{spot.avgStarRating} · {spot.numReviews}</p>
                    </h2>
                    <div>
                        <i className="fa fa-star"></i>
                        {spot.avgStarRating} · {spot.numReviews}
                    </div>

                    <OpenModalButton modalComponent={<CreateReviewFormModal spot={spot}/>} buttonText="Post Your Review"/>
            {reviews.map((review) => (
                <div>
                    <h3>{review.User?.firstName}</h3>
                    <h4>{review.createdAt}</h4>
                    <h4>{review.review}</h4>
                <div>
                <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id}/>} buttonText="Delete"/>
                </div>
                </div>
            ))}
        </section>
    </div>

    )
}

export default SpotDetails;
