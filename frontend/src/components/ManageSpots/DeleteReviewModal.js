import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/reviews"

const DeleteReviewModal = ({reviewId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteReview(reviewId))
        .then(closeModal)
    }

    const keepReview = (e) => {
        closeModal()
    }

    return (
        <div>
        <h3>Confirm Delete</h3>
        <h2>Are you sure you want to delete this review?</h2>
        <div>
            <button onClick={handleDelete}>Yes (Delete Review)</button>
            <button onClick={keepReview}>No (Keep Review)</button>
        </div>
    </div>
    )
}

export default DeleteReviewModal
