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

    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
    },[dispatch, spotId])

    useEffect(()=>{
        dispatch(getSpotReviews(spotId))
    },[dispatch, spotId])

    if(!spot.id || !spot.Owner) return null


    const allSpotImages = spot.SpotImages.filter(image => image.preview === false)

    return (
    <div className="spot-details">
        <div>
            <h2>{spot.name}</h2>
            <p> {spot.city}, {spot.state}, {spot.country}</p>
        </div>
        <div className='spotimages-container'>
            <div className='largeImg-container'>
            <img src={spot.SpotImages[0].url} alt={`${spot.name}`}></img>
            </div>
            <div className="smallimg-container">
                    {allSpotImages.map(image =><div className="small-images"> <img key={image.id} src={image.url} alt={spot.name}></img></div>)}
            </div>
        </div>

<div className="spot-hosted-reserve-container">

        <div>
            <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
            <p>{spot.description}</p>
        </div>

            <div className="reserve-box-container">
                <div className="reserve-box-price">
                    <h2>${spot.price} night</h2>
                </div>
                <div className="reserve-rat-rev">
                    <h2>
                        <i className="fa fa-star"></i>
                        {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(1) : 'New'} · {spot.numReviews}
                    </h2>
                </div>
                <div>
                    <button className="feature-alert-button" onClick={() => alert('Feature coming soon.')}>Reserve</button>
                </div>
            </div>
</div>


        <section>
                    <h2>
                        <p><i className="fa fa-star"></i>{spot.avgStarRating.toFixed(1)} · {spot.numReviews}</p>
                    </h2>
                <div>

                    <OpenModalButton
                        className="post-review-button"
                        modalComponent={<CreateReviewFormModal spot={spot}/>}
                        buttonText="Post Your Review"
                        />
                </div>

            {reviews.map((review) => (
                <div>
                    <h3>{review.User?.firstName}</h3>
                    <h4>{review.createdAt}</h4>
                    <h4>{review.review}</h4>
                <div>

                <OpenModalButton
                className="delete-review-button"
                modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id}/>}
                buttonText="Delete"/>
                </div>
                </div>
            ))}
        </section>
    </div>

    )
}

export default SpotDetails;
