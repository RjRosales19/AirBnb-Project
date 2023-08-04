import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/reviews"
// import { useParams } from "react-router-dom";
import "./DeleteReviewModal.css"
const DeleteReviewModal = ({reviewId, spotId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    // const { spotId } = useParams
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteReview(reviewId, spotId))
        .then(closeModal)
    }

    const keepReview = (e) => {
        closeModal()
    }

    return (
        <div className="delete-review-container">
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to delete this review?</h3>
            <button className="delete-review-button" onClick={handleDelete}>Yes (Delete Review)</button>
            <button className="keep-review-button" onClick={keepReview}>No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal
