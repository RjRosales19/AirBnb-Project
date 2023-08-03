import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
// import SpotDetails from "../SpotDetails";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import './ManageSpots.css'
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";

const ManageSpots = () => {
    const dispatch = useDispatch()
    const spots = Object.values(useSelector(state => state.spots.allSpots))
    const user = useSelector(state => state.session.user)
    const currUserSpots = spots.filter( spot => spot.ownerId === user.id)
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    const handleEdit = (spotId) => {
        history.push(`/spots/${spotId}/edit`)
    }
    return (
        <div>
            <h1>Manage Your Spots</h1>
            <button>Create a New Spot</button>
            <div className="user-grid-container">
            {currUserSpots.map(({ id, previewImage, city, state, price, name }) => (
                <div className='user-grid-item' key = { id }>
                    <Link to={`/spots/${id}`}>
                        <ul>
                            <img src={previewImage} alt={`${name}`}></img>
                            <span className='spot-info'>
                                <div>{city}, {state}</div>
                                <div>{price}</div>
                            </span>
                        </ul>
                    </Link>
                    <div>
                        <button onClick={() => handleEdit(id)}>Update</button>
                        <OpenModalButton modalComponent={<DeleteSpotModal spotId={id}/>} buttonText="Delete"/>


                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default ManageSpots;
