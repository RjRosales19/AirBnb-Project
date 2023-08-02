import { useDispatch } from "react-redux";
import { useState } from "react";
const SpotForm = ({ spot, formType }) => {
    const dispatch = useDispatch();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("")

    const [state, setState ] = useState("")
    const [country, setCountry ] = useState("")
    // const [lat, setLat] = useState(0)
    // const [lng, setLng] = useState(0)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    // const [previewImage, setPreviewImage] = useState("");
    // const [imageUrl2, setImageUrl2] = useState("")
    // const [imageUrl3, setImageUrl3] = useState("")
    // const [imageUrl4, setImageUrl4] = useState("")
    // const [imageUrl5, setImageUrl5] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>{formType}</h2>
            <label>
                Address:
                <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label>
                City:
                <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <label>
                State:
                <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label>
            <label>
                Country:
                <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <label>
                Name:
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Description:
                <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Price:
                <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>
        </form>
    )
}

export default SpotForm;
