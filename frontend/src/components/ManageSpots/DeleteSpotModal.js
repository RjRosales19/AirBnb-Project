import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";
const DeleteSpotModal = ({spotId}) => {
    const {closeModal} = useModal()
    const dispatch = useDispatch()


    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteSpot(spotId))
        .then(closeModal)
    }

    const keepSpot = (e) => {
        closeModal()
    }

    return (
        <div className="delete-spot-container">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this spot?</h3>
            <button className="delete-spot-button" onClick={handleDelete}>Yes (Delete Spot)</button>
            <button className="keep-spot-button" onClick={keepSpot}>No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal
