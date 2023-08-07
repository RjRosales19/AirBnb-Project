
import { csrfFetch } from "./csrf";

// Action Type Const
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const READ_SPOT = 'spots/READ_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/DELETE_SPOT';


// action creator
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})

export const readSpot = (spot) => ({
    type: READ_SPOT,
    spot
})

export const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

// thunk action creator get All SPOTS
export const getSpots =  () => async (dispatch, getState) =>{
    const res = await csrfFetch('/api/spots')

    if(res.ok){
        const spots = await res.json()
        const allSpots = spots.Spots
        dispatch(loadSpots(normalizedData(allSpots)))
    }else{
        const errors = await res.json()
        console.log(errors)
    }

    function normalizedData(arr){
        const normalObj = {};
        arr.forEach( obj => normalObj[obj.id] = obj);
        return normalObj
    }

}

// thunk action creator for get single spot
export const getSingleSpot = (spotId) => async ( dispatch, getState ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if(res.ok){
        const spotInfo = await res.json()
        dispatch(readSpot(spotInfo))
        return spotInfo
    }else{
        const errors = await res.json()
        console.log(errors)
    }
}

// thunk action creator for create spot
export const createSpot = (spot, newSpotImage) => async ( dispatch, getState ) => {

        const res = await csrfFetch(`/api/spots`, {
            method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(spot),
    })

    if(res.ok){
        const newSpot = await res.json();
        const newImages = await Promise.all(newSpotImage.map(
            async images => {
                const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(images),
                })
                if(imageData.ok){
                    const newImage = await imageData.json()
                    return newImage
                }
            }
            ))
            newSpot.SpotImages = newImages
            dispatch(readSpot(newSpot));
            return newSpot
        }else{
            const errors = await res.json()
            return errors
        }
}

// thunk action creator for delete spot
export const deleteSpot = (spotId) => async ( dispatch, getState ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    })
    if(res.ok) {
        dispatch(removeSpot(spotId));
    }else{
        const errors = await res.json();
        return errors
    }
}

//thunk action creator for edit spot
export const editSpot = (spot, spotId) => async ( dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method:'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });

    if(res.ok){
        const editedSpot = await res.json();
        dispatch(updateSpot(editedSpot))
        return editedSpot
    }else{
        const errors = await res.json();
        return errors
    }
}
const initialState = { allSpots: {}, singleSpot:{} }
// spot reducer
export default function spotReducer( state = initialState , action){
    let newState;
    switch(action.type){
        case LOAD_SPOTS:
            newState = { ...state, allSpots: {} };
            newState.allSpots = action.spots
            return newState
        case READ_SPOT:
            newState = { ...state, singleSpot: {}}
            newState.singleSpot = action.spot
            return newState
        case REMOVE_SPOT:
            newState = { ...state, allSpots: {...state.allSpots}}
            delete newState.allSpots[action.spotId]
            return newState
        case UPDATE_SPOT:
            newState = { ...state, allSpots: {...state.allSpots}, singleSpot: {...action.spot}}
            newState.allSpots[action.spot.id] = action.spot
            return newState
        default:
            return state
    }
}
