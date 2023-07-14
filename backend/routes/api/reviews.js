const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
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
router.post('/:reviewId/images', requireAuth, async(req,res) => {
    const user = req.user.id
    const currReviewId = req.params.reviewId
    const review = await Review.findByPk(currReviewId,{
        include:
        [
            {
                model: ReviewImage,
                attributes: ['id','reviewId','url']
            }
        ]
    })
    const {url} = req.body
    if(!review){
        res.status(404)
        return res.json({
            message: "Review couldn't be found"
        })
    }
    if(user !== review.userId){
        return res.status(401).json({ message: 'Invalid credentials'})
    }
    if(review.ReviewImages.length > 10){
        return res.status(403).json({ message: 'Maximum number of images for this resource was reached'})
    }
    const reviewImage = await ReviewImage.create({
        reviewId: currReviewId,
        url
    })
    const { createdAt, updatedAt, reviewId, ...newImageData} = reviewImage.toJSON()
    res.status(201).json(newImageData)
})

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
                attributes: ['id', 'ownerId','address','city','state','country','lat','lng','name','price','previewImage'],
                include: [{model:SpotImage, attributes:['spotId','url','preview']}]
            },
            {
                model:ReviewImage,
                attributes: ['id','url']
            },
        ]
    })
    if(!userReviews){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    let imageList = [];

    userReviews.forEach(review => {
        imageList.push(review.toJSON())
    })

    imageList.forEach(list => {
        console.log(list.Spot.SpotImages.preview)
        list.Spot.SpotImages.forEach(image => {
            console.log(list.Spot.SpotImages)
            let imageUrl = image.url
            list.Spot.previewImage = imageUrl
        })
        delete list.Spot.SpotImages
    })
    res.json({Reviews: imageList})
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
    if(user !== updatedReview.userId){
        return res.status(401).json({ message: 'Invalid credentials'})
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

    if(user === review.userId){
        await review.destroy();
        return res.json({message: "Successfully deleted"})
    }
    res.status(401).json({ message: 'Invalid credentials'})
})

module.exports = router;
