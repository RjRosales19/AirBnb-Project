import { useDispatch } from "react-redux"
import { Link } from 'react-router-dom'

export default function SpotDetails({spot}){
    const dispatch = useDispatch()


    return (
        <li>
            <div className="">
                <h1>Spot Details</h1>
                <Link to={`/spots/${spot.id}`}>Spot #{spot.id}</Link>
            </div>
        </li>
    )
}
