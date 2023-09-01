import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteBooking } from "../../store/bookings";

const DeleteBookingModal = ({bookingId, spotId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async(e) => {
        e.preventDefault();
        dispatch(thunkDeleteBooking(bookingId, spotId))
        .then(closeModal)
    }

    const keepBooking = (e) => {
        closeModal()
    }

    
    return (
        <div>
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to delete this booking?</h3>
            <button onClick={handleDelete}>Yes (Delete Booking)</button>
            <button onClick={keepBooking}>No (I WANT TO STAY HERE)</button>
        </div>
    )
}

export default DeleteBookingModal
