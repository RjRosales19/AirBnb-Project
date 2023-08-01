import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getSpots } from '../../store/spots'
import SpotDetails from  '../SpotDetails/index.js'


const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    return (
        <section>
                <ul>
                    <h1>All Spots</h1>
                    <div>
                        {spots.map((spot)=> (
                            <SpotDetails
                            spot = { spot }
                            key = { spot.id }
                            />
                            ))}
                        </div>
                </ul>
        </section>
    )
}

export default AllSpots
