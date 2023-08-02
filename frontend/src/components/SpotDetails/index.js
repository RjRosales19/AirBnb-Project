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
        <section>

        </section>
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
            <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
            <h2>{spot.description}</h2>
            <section>
                <h2>{spot.price}</h2>
                <h2>{spot.numReviews}</h2>
                <h2>{spot.avgStarRating}</h2>
            </section>
        <section>
            <div>REVIEWS INFORMATION</div>
        </section>
    </div>

    )
}

export default SpotDetails;
