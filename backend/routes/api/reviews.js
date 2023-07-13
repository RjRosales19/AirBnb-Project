const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];
router.get('/current', requireAuth, async (req,res) => {
    const userId = req.user.id;
    const userReviews = await Review.findAll({
        where: {
            userId : userId
        },
        include: [
            {
                model:User,
                attributes: ['id','firstName','lastName']
            },
            {
                model:Spot,
                attributes: ['id', 'ownerId','address','city','state','country','lat','lng','name','price','previewImage']
            },
            {
                model:ReviewImage,
                attributes: ['id','url']
            }
        ]
    })
    if(!userReviews){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json({Reviews: userReviews})
})

router.post('/:reviewId/images', requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId
    const reviewImage = await ReviewImage.create({
        reviewId
    })
    if(!reviewId){
        res.status(404)
        return res.json({
            message: "Review couldn't be found"
        })
        }
        res.status(201).json(reviewImage)
})

router.put('/:reviewId', requireAuth, validateReview, async (req,res) => {
    const user = req.user.id
    const updatedReview = await Review.findByPk(req.params.reviewId)
    const { review, stars } = req.body

    if(!updatedReview){
        return res.status(404).json({message: "Review couldn't be found"})
    }
    if(review !== undefined){
        updatedReview.review = review;
    }
    if(stars !== undefined){
        updatedReview.stars = stars;
    }
    if(user === updatedReview.spotId){
    }
    await updatedReview.save();
    res.status(201).json(updatedReview)

})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const user =  req.user.id
    const review = await Review.findByPk(req.params.reviewId);

    if(!review){
        return res.status(404).json({message: "Review couldn't be found"});
    }

    if(user === review.reviewId){
        await review.destroy();
        return res.json({message: "Successfully deleted"})
    }
    res.status(401).json({ message: 'Invalid credentials'})
})

module.exports = router;
