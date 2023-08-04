import { createReview } from "../../store/reviews"
import { useModal } from "../../context/Modal"
import { useState } from "react"
import { useDispatch } from "react-redux"
import "./CreateReviewFormModal.css"


const CreateReviewFormModal = ({spot}) => {
    const dispatch = useDispatch()

    const [ review, setReview ] = useState("")
    const [ stars, setStars ] = useState(0)
    const { closeModal } = useModal()
    const [ activeRating, setActiveRating ] = useState(stars)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {
            review,
            stars
        }
        await dispatch(createReview(newReview, spot.id))

        .then(closeModal)
    }
    return(
        <form>
            <div className="review-form-container">

            <h2>How was your stay?</h2>
            <textarea
            placeholder="Leave your review here..."
            value={review}
            type={"text"}
            onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <div className="stars-container">

            <div className='stars-input'>

            <div
            className={activeRating >= 1 ? 'filled' : 'empty'}
            onClick={(e) => setStars(1)}
            onMouseEnter={(e) => setActiveRating(1)}
            onMouseLeave={(e) => setActiveRating(stars)}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
            className={activeRating >= 2 ? 'filled' : 'empty'}
            onClick={(e) => setStars(2)}
            onMouseEnter={(e) => setActiveRating(2)}
            onMouseLeave={(e) => setActiveRating(stars)}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
            className={activeRating >= 3 ? 'filled' : 'empty'}
            onClick={(e) => setStars(3)}
            onMouseEnter={(e) => setActiveRating(3)}
            onMouseLeave={(e) => setActiveRating(stars)}
            >
                <i className="fa fa-star"></i>
            </div>

            <div
            className={activeRating >= 4 ? 'filled' : 'empty'}
            onClick={(e) => setStars(4)}
            onMouseEnter={(e) => setActiveRating(4)}
            onMouseLeave={(e) => setActiveRating(stars)}
            >
                <i className="fa fa-star"></i>
            </div>

            <div
            className={activeRating >= 5 ? 'filled' : 'empty'}
            onClick={(e) => setStars(5)}
            onMouseEnter={(e) => setActiveRating(5)}
            onMouseLeave={(e) => setActiveRating(stars)}
            >
                <i className="fa fa-star"></i>
            </div>


                </div>

            </div>
            <button onClick={handleSubmit}>Submit Your Review</button>
                </div>
        </form>
    )
}

export default CreateReviewFormModal
