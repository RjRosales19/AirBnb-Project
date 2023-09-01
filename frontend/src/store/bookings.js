import { csrfFetch } from "./csrf";
import { getSingleSpot } from "./spots";

// ACTION TYPES
export const LOAD_BOOKINGS = 'bookings/LOAD_BOOKINGS'
export const CREATE_BOOKING = 'bookings/CREATE_BOOKING'

// ACTION CREATORS
export const loadBookings = (bookings) => ({
    type: LOAD_BOOKINGS,
    bookings
})

export const createBooking = (booking, spotId) => ({
    type: CREATE_BOOKING,
    booking,
    spotId
})
// THUNK ACTION CREATOR

export const thunkGetBookings = () => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/bookings/current`)
    if (res.ok) {
        const spotBookings = await res.json()
        dispatch(loadBookings(spotBookings))
    }else{
        const errors = await res.json()
        return errors
    }
    // function normalizedData(arr) {
    //     const normalObj = {};
    //     console.log(arr)
    //     arr.forEach(obj => normalObj[obj.id] = obj);
    //     return normalObj
    // }
}


export const thunkCreateBooking = (booking, spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(booking)
    })

    if(res.ok){
        const newBooking = await res.json();
        dispatch(thunkGetBookings(spotId))
        return newBooking
    }else{
        const error = await res.json()
        return error
    }
}

export const thunkDeleteBooking = (bookingId, spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    if(res.ok){
        dispatch(thunkGetBookings(spotId))
        dispatch(getSingleSpot(spotId))
    }else{
        const errors = await res.json()
        return errors
    }
}
// BOOKINGS REDUCER
const initialState = { spot: {} }

export default function bookingsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case LOAD_BOOKINGS:
            newState = { ...state, spot: {...state.spot} }
            newState.spot = action.bookings
            return newState
        default:
            return state
    }
}
