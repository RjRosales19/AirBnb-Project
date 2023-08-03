import { getSingleSpot } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
const SpotReviews = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams()

    return(
        <div>
            <h2>New</h2>
            <h3>Be the first to post a review!</h3>
        </div>
    )
}

export default SpotReviews;
