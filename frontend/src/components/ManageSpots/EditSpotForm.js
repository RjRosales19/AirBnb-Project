import { useDispatch, useSelector } from "react-redux"
import React, { useEffect, useState } from "react";
import { editSpot } from "../../store/spots";
import { useHistory, useParams } from "react-router-dom"
import "./EditSpotForm.css"

const EditSpotForm = ({spot, formType}) => {
    const dispatch = useDispatch()
    const currEditSpot = useSelector(state => state.spots.singleSpot)
    const history = useHistory()
    const {spotId} = useParams()
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city)
    const [state, setState ] = useState(spot?.state)
    const [country, setCountry ] = useState(spot?.country)
    const [lat, setLat] = useState(spot?.lat)
    const [lng, setLng] = useState(spot?.lng)
    const [name, setName] = useState(spot?.name)
    const [description, setDescription] = useState(spot?.description)
    const [price, setPrice] = useState(spot?.price)
    // const [previewImage, setPreviewImage] = useState("");
    // const [imageUrl2, setImageUrl2] = useState("")
    // const [imageUrl3, setImageUrl3] = useState("")
    // const [imageUrl4, setImageUrl4] = useState("")
    // const [imageUrl5, setImageUrl5] = useState("")
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setAddress(currEditSpot.address || '')
        setCity(currEditSpot.city || '')
        setState(currEditSpot.state || '')
        setCountry(currEditSpot.country || '')
        setLat(currEditSpot.lat || '')
        setLng(currEditSpot.lng || '')
        setName(currEditSpot.name || '')
        setDescription(currEditSpot.description || '')
        setPrice(currEditSpot.price || '')
    }, [currEditSpot])

    const handleSubmit = async (e) => {
        e.preventDefault()
        spot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }

        if(formType === 'Update Spot'){
            const newlyUpdatedSpot = await dispatch(editSpot(spot, spotId))
            spot = newlyUpdatedSpot
        }
        if(spot.errors){
            setErrors(spot.errors)
        }else{
            history.push(`/spots/${spotId}`)
        }
    }

    if(!spot.id){
        return null
    }
    return(
        <div className="edit-spot-form-container">

        <form className="update-spot-form" onSubmit={handleSubmit}>

            <h1>Update your Spot</h1>

        <section className="location-container">
            <h3>Where's your place located?</h3>
            <h4>Guests will only get your exact address once they booked a reservation</h4>
            <div className="errors">{errors.country}</div>
            <label>
                Country
                <input
                className="country-input"
                type="text"
                value={country}
                placeholder="Country"
                onChange={(e) => setCountry(e.target.value)}
                />
            </label>

            <div className="errors">{errors.address}</div>
            <label>
                Street Address
                <input
                className="street-address-input"
                type="text"
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>

        <div className="city-state-container">
            <div className="errors">{errors.city}</div>
            <label>
                City
                <input
                className="city-input"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <span className="comma" > , </span>
            <div className="errors">{errors.state}</div>
            <label>
                State
                <input
                className="state-input"
                type="text"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label>
        </div>

        <div className="lat-long-container">
            <div className="errors">{errors.lat}</div>
            <label>
                Latitude
                <input
                className="latitude-input"
                type="number"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                />
            </label>
            <span className="comma" > , </span>
            <div className="errors">{errors.lng}</div>
            <label>
                Longitude
                <input
                className="longitude-input"
                type="number"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                />
            </label>
        </div>
    </section>


        <section className="description-container">
            <h3>Describe your place to guests</h3>
            <h5>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h5>
            <div className="errors">{errors.description}</div>
            <textarea
                className="textarea-input"
                placeholder="Please write at least 30 characters"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
        </section>


            <h2>Create a title for your spot</h2>
            <h3>Catch guests' attention with a spot title that highlights what makes your place special.</h3>
            <div className="errors">{errors.name}</div>
                <input
                    className="name-input"
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />

            <h2>Set a base price for your spot</h2>
            <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>
            <div className="errors">{errors.price}</div>
            <label>
                $
                <input
                className="price-input"
                type="number"
                value={price}
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>

            {/* <h2>Liven up your spot with photos</h2>
            <h3>Submit a link to at least one photo to publish your spot</h3>
            <div className="errors">{errors.previewImage}</div>
            <label>
                Preview Image Url:
                <input
                type='url'
                value={previewImage}
                placeholder="Preview Image URL"
                onChange={(e) => setPreviewImage(e.target.value)}
                />
                </label>

                <div className="errors">{errors.imageUrl2}</div>
                <label>
                Image Url:
                <input
                type='url'
                value={imageUrl2}
                placeholder="Image URL"
                onChange={(e) => setImageUrl2(e.target.value)}
                />
                </label>

                <div className="errors">{errors.imageUrl3}</div>
                <label>
                Image Url:
                <input
                type='url'
                value={imageUrl3}
                placeholder="Image URL"
                onChange={(e) => setImageUrl3(e.target.value)}
                />
                </label>

                <div className="errors">{errors.imageUrl4}</div>
                <label>
                Image Url:
                <input
                type='url'
                value={imageUrl4}
                placeholder="Image URL"
                onChange={(e) => setImageUrl4(e.target.value)}
                />
                </label>

                <div className="errors">{errors.imageUrl5}</div>
                <label>
                Image Url:
                <input
                type='url'
                value={imageUrl5}
                placeholder="Image URL"
                onChange={(e) => setImageUrl5(e.target.value)}
                />
            </label> */}
            <div>

            <button className="update-submit-button" type="submit">{formType}</button>
            </div>
        </form>
    </div>
    )
}

export default EditSpotForm
