// import { getSingleSpot } from "../../store/spots";
// import { getSpotReviews } from "../../store/reviews";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// const SpotReviews = ({reviews}) => {
//     const spot = useSelector(state => state.spots.singleSpot)
//     const currUser = useSelector(state => state.session.user)
//     const dispatch = useDispatch();
//     const { spotId } = useParams()

//     useEffect(()=> {
//         dispatch(getSingleSpot(spotId))
//     },[dispatch,spotId])
//     useEffect(()=>{
//         dispatch(getSpotReviews(spotId))
//     }, [dispatch, spotId])
//     return(
//         <div>
//             <h2>New</h2>
//             <h3>Be the first to post a review!</h3>
//         </div>
//     )
// }

// export default SpotReviews;
