import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getSpots } from '../../store/spots'
import { Link } from 'react-router-dom'
import React from 'react'

const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = Object.values(useSelector(state => state.spots.allSpots ));
    console.log(spots)

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    if(!spots) return null

    return (
        <section>
                <ul>
                    <h1>All Spots</h1>
                    <div>
                        {spots.map(({ id, previewImage, city, state, price, name }) => (
                            <div key = { id }>
                                <Link to={`/spots/${id}`}>
                                    <ul>
                                        <img src={previewImage} alt={`${name}`}></img>
                                        <div>{city}, {state}</div>
                                        <div>{price}</div>
                                    </ul>
                                </Link>
                            </div>
                            ))}
                        </div>
                </ul>
        </section>
    )
}

export default AllSpots
