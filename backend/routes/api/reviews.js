const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

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
    res.json(userReviews)
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
        res.json(reviewImage)
})

router.put('/:reviewId', requireAuth, async (req,res) => {
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

    await updatedReview.save();
    res.json({
        updatedReview
    })
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
