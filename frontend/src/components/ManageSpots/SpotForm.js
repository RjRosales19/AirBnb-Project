import { useDispatch, useSelector } from "react-redux";
import {  useState } from "react";
import { createSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./SpotForm.css"
const SpotForm = ({ spot, formType }) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const currUser = useSelector(state => state.session.user)
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("")
    const [state, setState ] = useState("")
    const [country, setCountry ] = useState("")
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [previewImage, setPreviewImage] = useState("");
    const [imageUrl2, setImageUrl2] = useState("")
    const [imageUrl3, setImageUrl3] = useState("")
    const [imageUrl4, setImageUrl4] = useState("")
    const [imageUrl5, setImageUrl5] = useState("")
    const [errors, setErrors] = useState({})


    if(!currUser) history.push('/')


    const handleSubmit = async (e) => {
        e.preventDefault();

    spot = {
        ...spot,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    }
    const newSpotImage = [
            {
                url: previewImage,
                preview: true
            },
            {
                url: imageUrl2,
                preview: false
            },
            {
                url: imageUrl3,
                preview: false
            },
            {
                url: imageUrl4,
                preview: false
            },
            {
                url:imageUrl5,
                preview: false
            }
        ]

        if(formType === 'Create Spot'){
            await  dispatch(createSpot(spot, newSpotImage))
            .then(async (spot) => {
                if(spot && spot.id){
                    history.push(`/spots/${spot.id}`)
                }
            })
            .catch(async (errors) => {
                const err = await errors.json()
                if(err){ setErrors(err.errors)}
            })
        }
            };


    return (
        <div className="create-spot-container">

        <form className="create-spot-form" onSubmit={handleSubmit}>

            <h1>Create a New Spot</h1>

            <section className="location-container">
            <h3>Where's your place located?</h3>
            <h4>Guests will only get your exact address once they booked a reservation</h4>
            <label>
                Country
                <input
                className="country-input"
                type="text"
                minLength="1"
                // required
                value={country}
                placeholder="Country"
                onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <div className="errors">{errors.country}</div>

            <label>
                Street Address
                <input
                className="street-address-input"
                type="text"
                // required
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <div className="errors">{errors.address}</div>

        <div className="city-state-container">
            <label>
                City
                <input
                className="city-input"
                type="text"
                // required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
                <div className="errors">{errors.city}</div>
            </label>
            <span className="comma" > , </span>
            <label>
                State
                <input
                className="state-input"
                type="text"
                // required
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            <div className="errors">{errors.state}</div>
            </label>
        </div>

        <div className="lat-long-container">
            <label>
                Latitude
                <input
                className="latitude-input"
                type="number"
                // required
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                />
            <div className="errors">{errors.lat}</div>

            </label>
            <span className="comma" > , </span>
            <label>
                Longitude
                <input
                className="longitude-input"
                type="number"
                // required
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                />
            <div className="errors">{errors.lng}</div>
            </label>
                </div>
        </section>

        <section className="description-container">

            <h3>Describe your place to guests</h3>
            <h5>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h5>
                <textarea
                rows="5"
                cols="55"
                className="textarea-input"
                placeholder="Please write at least 30 characters"
                type="text"
                // minLength={30}
                // required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            <div className="errors">{errors.description}</div>
        </section>
        <section>

            <h2>Create a title for your spot</h2>
            <h4>Catch guests' attention with a spot title that highlights what makes your place special.</h4>
                <input
                    className="name-input"
                    type="text"
                    // required
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
            <div className="errors">{errors.name}</div>
        </section>
        <section>

            <h2>Set a base price for your spot</h2>
            <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>


            <label>
                $
                <input
                className="price-input"
                type='number'
                value={price}
                // required
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
                />
            <div className="errors">{errors.price}</div>
            </label>
        </section>
        <section>

            <h2>Liven up your spot with photos</h2>
            <h4>Submit a link to at least one photo to publish your spot</h4>
        <div className="image-input-container">

        <div>
                <input
                className="preview-image-input"
                type='url'
                value={previewImage}
                // required
                placeholder="Preview Image URL"
                onChange={(e) => setPreviewImage(e.target.value)}
                />
            <div className="errors">{errors.previewImage}</div>
        </div>

        <div>
                <input
                className="imageurl2-input"
                type='url'
                value={imageUrl2}
                // required
                placeholder="Image URL"
                onChange={(e) => setImageUrl2(e.target.value)}
                />
            <div className="errors">{errors.imageUrl2}</div>
        </div>

        <div>
                <input
                className="imageurl3-input"
                type='url'
                // required
                value={imageUrl3}
                placeholder="Image URL"
                onChange={(e) => setImageUrl3(e.target.value)}
                />
            <div className="errors">{errors.imageUrl3}</div>
        </div>

        <div>
                <input
                className="imageurl4-input"
                type='url'
                value={imageUrl4}
                // required
                placeholder="Image URL"
                onChange={(e) => setImageUrl4(e.target.value)}
                />
            <div className="errors">{errors.imageUrl4}</div>
        </div>

        <div>
                <input
                className="imageurl5-input"
                type='url'
                // required
                value={imageUrl5}
                placeholder="Image URL"
                onChange={(e) => setImageUrl5(e.target.value)}
                />
            <div className="errors">{errors.imageUrl5}</div>
        </div>
    </div>
        </section>
            <div>

            </div>
            <button className="create-submit-button" type="submit">{formType}</button>
        </form>
    </div>
    )
}

export default SpotForm;
