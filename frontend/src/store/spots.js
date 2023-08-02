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
    payload: spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    payload: spotId
})

// thunk action creator
export const getSpots =  () => async (dispatch, getState) =>{
    const res = await csrfFetch('/api/spots')

    if(res.ok){
        const spots = await res.json()
        const allSpots = spots.Spots
        dispatch(loadSpots(allSpots))
    }else{
        const errors = await res.json()
        console.log(errors)
    }

}

export const getSingleSpot = (spotId) => async ( dispatch, getState ) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if(res.ok){
        const spotInfo = await res.json()
        console.log(spotInfo)
        dispatch(readSpot(spotInfo))
        return spotInfo
    }else{
        const errors = await res.json()
        console.log(errors)
    }
}

export const createSpot = (spot) => async ( dispatch, getState ) => {
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(spot),
    })

    if(res.ok){
        const newSpot = await res.json();
        dispatch(readSpot(newSpot));
        return newSpot
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
            const  spotState = { ...state };
            delete spotState[action.spotId]
            return spotState
        default:
            return state
    }
}
