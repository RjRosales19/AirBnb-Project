import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

import { useDispatch } from "react-redux"
import { thunkCreateBooking } from "../../store/bookings"
import { useModal } from "../../context/Modal"
import { getSingleSpot } from "../../store/spots"

const CreateBookingModal = ({spot}) => {
    const [ startDate, setStartDate ] = useState(new Date())
    const [ endDate , setEndDate ] = useState(new Date())
    const dispatch = useDispatch()
    const { closeModal }  = useModal()
    const [ errors, setErrors ] = useState({})
    
    const handleSubmit = async(e) => {
        console.log(startDate)
        e.preventDefault()

        const newBooking = {
            startDate,
            endDate
        }
        await dispatch(thunkCreateBooking(newBooking, spot.id))
        await dispatch(getSingleSpot(spot.id))
        .then(closeModal)
        .catch((error) => {
            setErrors(error)
        })

    }
    return(
        <form>
            <div>Check-in</div>
            <DatePicker selected={startDate} dateFormat= "MMMM d, yyyy h:mm aa" onChange={(date) => setStartDate(date)} />
            <DatePicker selected={endDate} dateFormat= "MMMM d, yyyy h:mm aa" onChange={(date) => setEndDate(date)} />
            <div>Checkout</div>
            <button onClick={handleSubmit}>Reserve booking</button>
        </form>
    )
}

export default CreateBookingModal
