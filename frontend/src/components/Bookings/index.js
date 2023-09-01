// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux"
// import { thunkGetBookings } from "../../store/bookings";
// import { useParams } from "react-router-dom";

// const Bookings = () => {
//     const dispatch = useDispatch()
//     const { spotId } = useParams()
//     const bookings = Object.values(useSelector(state => state.bookings.spot));

//     useEffect(() => {
//         dispatch(thunkGetBookings(spotId))
//     }, [dispatch, spotId])


//     if(!bookings[0]) return null


//     return(
//         <section>
//             <div>
//             {bookings[0].map(({spotId, userId, startDate, endDate })=>(
//                 <div>
//                     <h1>{spotId}</h1>
//                     <h1>{userId}</h1>
//                     <h1>{startDate}</h1>
//                     <h1>{endDate}</h1>
//                 </div>
//             ))}
//             </div>
//         </section>
//     )
// }

// export default Bookings
