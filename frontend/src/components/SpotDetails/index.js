import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { getSingleSpot } from "../../store/spots";

const SpotDetails = () =>{
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    console.log(spot)
    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
    },[dispatch, spotId])

    if(!spot.id || !spot.Owner) return null

    return (
    <div>
        <div>
            <h2>{spot.name}</h2>
            <p> {spot.city}, {spot.state}, {spot.country}</p>
        </div>
        <div>
            <div>
            <img src={spot.previewImage} alt={`${spot.name}`}></img>
            </div>
            <div>

            </div>
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
            <div>REVIEWS INFORMATION</div>
        </section>
    </div>

    )
}

export default SpotDetails;
