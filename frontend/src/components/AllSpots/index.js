import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getSpots } from '../../store/spots'
import { SpotDetails } from '../SpotDetails'

const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    return (
        <section>

            <div className="">
                <ul>
                    <h1>All Spots</h1>
                        {spots.map((spot)=> (

                            <SpotDetails  spot={ spot } key ={spot.id} />
                            
                        ))}
                </ul>
            </div>
        </section>
    )
}

export default AllSpots
