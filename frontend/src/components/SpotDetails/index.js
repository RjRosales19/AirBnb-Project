import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { getSingleSpot } from "../../store/spots";

const SpotDetails = () =>{
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots ? state.spots[spotId] : null)

    useEffect(()=> {
        dispatch(getSingleSpot(spotId))
    },[dispatch, spotId])

    return (
    <li>
            <div>
            <img src={spot.previewImage} alt={`${spot.name}`}></img>
            </div>
    </li>

    )
}

export default SpotDetails
