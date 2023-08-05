import { useDispatch } from "react-redux";
import { useState } from "react";
import { createSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./SpotForm.css"
const SpotForm = ({ spot, formType }) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("")
    const [state, setState ] = useState("")
    const [country, setCountry ] = useState("")
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [previewImage, setPreviewImage] = useState("");
    const [imageUrl2, setImageUrl2] = useState("")
    const [imageUrl3, setImageUrl3] = useState("")
    const [imageUrl4, setImageUrl4] = useState("")
    const [imageUrl5, setImageUrl5] = useState("")
    const [errors, setErrors] = useState({})

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
            const newlyCreatedSpot = await dispatch(createSpot(spot, newSpotImage))
            spot = newlyCreatedSpot
        }
        if(spot.errors){
            setErrors(spot.errors)
        }else{
            history.push(`/spots/${spot.id}`)
        }
    };
    return (
        <div className="create-spot-container">

        <form className="create-spot-form" onSubmit={handleSubmit}>

            <h1>Create a New Spot</h1>

            <section>
            <h2>Where's your place located?</h2>
            <h3>Guests will only get your exact address once they booked a reservation</h3>
            <div className="errors">{errors.country}</div>
            <label>
                Country
                <input
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
                type="text"
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>

            <div className="errors">{errors.city}</div>
            <label>
                City
                <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </label>

            <div className="errors">{errors.state}</div>
            <label>
                State
                <input
                type="text"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label>

            <div className="errors">{errors.lat}</div>
            <label>
                Latitude
                <input
                type="text"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                />
            </label>

            <div className="errors">{errors.lng}</div>
            <label>
                Longitude
                <input
                type="text"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                />
            </label>
        </section>

        <section>

            <h2>Describe your place to guests</h2>
            <h3>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h3>
            <div className="errors">{errors.description}</div>
            <label>
                Description:
                <textarea
                placeholder="Please write at least 30 characters"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </label>
        </section>
        <section>

            <h2>Create a title for your spot</h2>
            <h3>Catch guests' attention with a spot title that highlights what makes your place special.</h3>
            <div className="errors">{errors.name}</div>
            <label>
                Name:
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
            </label>
        </section>
        <section>

            <h2>Set a base price for your spot</h2>
            <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
            <div className="errors">{errors.price}</div>
            <label>
                Price:
                <input
                type="text"
                value={price}
                placeholder="Price per night (USD)"
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>
        </section>
        <section>

            <h2>Liven up your spot with photos</h2>
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
            </label>
        </section>
            <div>

            </div>
            <button type="submit">{formType}</button>
        </form>
    </div>
    )
}

export default SpotForm;
