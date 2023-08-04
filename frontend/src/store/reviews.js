import { csrfFetch } from "./csrf";

// Action Type Const
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const READ_REVIEW = 'reviews/READ_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

//action creator for reviews
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
})

export const readReview = (review, spotId) => ({
    type: READ_REVIEW,
    review,
    spotId

})

export const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
})

//thunk action creator for get all reviews for a spot
export const getSpotReviews = (spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(res.ok){
        const reviews = await res.json()
        dispatch(loadReviews(reviews.Reviews))
        return reviews
    }else{
        const errors = await res.json()
        return errors
    }

}

//thunk action creator for creating a review for a spot
export const createReview = (review, spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(review),
    })
    if(res.ok){
        const newReview = await res.json();
        console.log(newReview)
        dispatch(loadReviews(spotId))
        return newReview
    }else{
        const error = await res.json()
        return error
    }
}
//thunk action creator for deleting a review for a spot
export const deleteReview = (reviewId, spotId) => async ( dispatch, getState ) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
    if(res.ok){
        dispatch(removeReview(reviewId));
    }else{
        const errors = await res.json()
        return errors
    }
}

// review reducer
const initialState = { singleSpot:{} }
export default function reviewsReducer( state = initialState, action ) {
    let newState;
    switch(action.type){
        case LOAD_REVIEWS:
            newState = { ...state, singleSpot: {...state.singleSpot}}
            newState.singleSpot = action.reviews
            return newState
        case READ_REVIEW:
            newState = { ...state, singleSpot: {}}
            newState.singleSpot = action.review
            return newState
        case REMOVE_REVIEW:
            newState = { ...state, singleSpot: {}}
            delete newState[action.reviewId]
            return newState
        default:
            return state
    }
}
