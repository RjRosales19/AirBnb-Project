import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { thunkGetBookings } from "../../store/bookings"
import { Link } from "react-router-dom"
import { getSingleSpot } from "../../store/spots"
import OpenModalButton from "../OpenModalButton"
import DeleteBookingModal from "../Bookings/DeleteBookingModal"


const ManageBookings = () => {
    const dispatch = useDispatch()
    const bookings = Object.values(useSelector(state => state.bookings.spot))
    const user = useSelector(state => state.session.user)
    const currUserBookings = bookings.filter(booking => booking[0].userId === user.id)
    // console.log(bookings[0][0].Spot.name, currUserBookings, user)


    useEffect(() => {
        dispatch(thunkGetBookings())
    }, [dispatch])

    if (!currUserBookings[0] || !bookings[0]) return null

    return (
        <div>
            <h1>Manage Your Bookings</h1>
            {currUserBookings[0].map(({ Spot, id, startDate, endDate }) => (
                <div>
                    <Link to={`/spots/${id}`}>
                        <span>

                            <h1>{Spot.previewImage}</h1>
                            <h1>{Spot.name}</h1>
                            <div>{Spot.country}</div>
                            <div>{Spot.city}</div>
                            <div>{startDate}</div>
                            <div>{endDate}</div>
                            <div>${Spot.price}</div>
                        </span>
                    </Link>
                    <div>
                        <button>Edit Booking</button>
                        <button>Delete Booking</button>
                        <OpenModalButton modalComponent={<DeleteBookingModal spotId={id}/>}buttonText={"Delete"}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ManageBookings
