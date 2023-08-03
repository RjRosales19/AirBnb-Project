import { useDispatch, useSelector } from "react-redux";
import EditSpotForm from "./EditSpotForm";
import { useParams } from "react-router-dom";
import { getSingleSpot } from "../../store/spots";
import { useEffect } from "react";

const UpdatedSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot)

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
    }, [dispatch, spotId])

    if(!spot) return null

    return (

        <EditSpotForm
        formType="Update Spot"
        spot={spot}
        />
    )
}

export default UpdatedSpot;
