import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
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
        <div>
            <h3>Confirm Delete</h3>
            <h2>Are you sure you want to remove this spot from this listings?</h2>
            <div>
                <button onClick={handleDelete}>Yes(Delete Spot)</button>
                <button onClick={keepSpot}>No(Keep Spot)</button>
            </div>
        </div>
    )
}

export default DeleteSpotModal
