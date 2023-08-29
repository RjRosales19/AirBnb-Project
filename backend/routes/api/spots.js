const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize')

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .isString()
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isNumeric()
        .notEmpty()
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description needs 30 or more characters"),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Price per night is required"),
        handleValidationErrors
    ];

    // const validateQuery = [
    //     check('page')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Page must be greater than or equal to 1"),
    //     check('size')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Size must be greater than or equal to 1"),
    //     check('maxLat')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Maximum latitude is invalid"),
    //     check('minLat')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Minimum latitude is invalid"),
    //     check('minLng')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Minimum longitude is invalid"),
    //     check('maxLng')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Maximum longitude is invalid"),
    //     check('minPrice')
    //         .exists({ checkFalsy: true })
    //         .isLength({max:49})
    //         .withMessage("Minimum price must be greater than or equal to 0"),
    //     check('maxPrice')
    //         .exists({ checkFalsy: true })
    //         .notEmpty()
    //         .withMessage("Maximum price must be greater than or equal to 0"),
    //     handleValidationErrors
    // ]


    router.post('/:spotId/reviews', requireAuth, validateReview, async (req,res) => {
        const spotId = req.params.spotId
        const userId = req.user.id
        const {review, stars} = req.body
        const spot = await Spot.findByPk(spotId)

        if(!spot){
            res.status(404)
            return res.json({
                message: "Spot couldn't be found"
            })
        }
        const currReview = await Review.findOne({
            where: {
                userId, spotId
            }
        })
        if(currReview){
            res.status(500).json({message: "User already has a review for this spot"})
        }
        const newReview = await Review.create({
            spotId,
            userId,
            review,
            stars
        })
        if(userId !== review.userId){
            res.status(201).json(newReview)
        }
    })

router.get('/:spotId/reviews', async (req,res) => {
    const spot = req.params.spotId
    const currSpot = await Spot.findByPk(spot)
    const reviews = await Review.findAll({
        where: {
            spotId: spot
        },
        include:[
            {
                model:User,
                attributes: ['id','firstName','lastName']
            },
            {
                model:ReviewImage,
                attributes: ['id','url']
            }
        ]
    })
    if(!currSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    let imageList = [];
    reviews.forEach(review=> {
        imageList.push(review.toJSON())
    })
    imageList.forEach(list=> {
        list.ReviewImages.forEach(image => {

            imageList.push(image)
        })

    })
    res.json({Reviews: imageList})
})


router.get('/:spotId/bookings', requireAuth, async(req,res) => {
    const spotId = req.params.spotId
    const user = req.user.id
    const currSpot = await Spot.findByPk(spotId)
    if(!currSpot){
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    if(currSpot.ownerId === user){
        const bookingsByOwner = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include:[
                {
                    model:User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })
        return res.json({Bookings: bookingsByOwner})
    }
    const bookings = await Booking.findAll({
        where: {
            spotId: spotId
        },
        attributes:['spotId','startDate','endDate']
    })
    return res.json({Bookings: bookings})
})

// accepts overlapping bookings of the same spot
router.post('/:spotId/bookings', requireAuth, async(req,res) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const {startDate, endDate} = req.body
    const currSpot = await Spot.findByPk(spotId)

    if(!currSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    const conflicting = await Booking.findOne({
        where: {
            spotId: spotId,
            [Op.or]: [
                {

                    startDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },{

                    endDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            ]
        }
    })
    if(conflicting){
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors:{
                startDate:"Start date conflicts with an existing booking",
                endDate:"End date conflicts with an existing booking",
            }
        })
    }
    if(new Date(startDate) >= new Date(endDate)){
        return res.status(400).json({message: "endDate cannot be on or before startDate"})
    }
    if(userId !== currSpot.ownerId){
        const booking = await Booking.create({
            spotId: currSpot.id,
            userId: userId,
            startDate,
            endDate
        })
        res.json(booking)
    }
})

router.post('/:spotId/images', requireAuth, async(req,res) => {
    const user = req.user.id
    const currSpotId = req.params.spotId
    const {url, preview } = req.body
    const spot = await Spot.findByPk(currSpotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id','spotId','url','preview']
            }
        ]
    })
    if(!spot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    if(user !== spot.ownerId){
        return res.status(401).json({ message: 'Invalid credentials'})
    }
    const spotImage = await SpotImage.create({
        spotId: currSpotId,
        url,
        preview
    })

    const { createdAt, updatedAt, spotId, ...newImageData} = spotImage.toJSON()
    res.json(newImageData)

})

router.get('/current', requireAuth, async (req,res) => {
    const user = req.user.id;
    const userSpots = await Spot.findAll({
        where: {
            ownerId: user
        },
        include:
        [
            {
                model: Review,
                attributes: ['id', 'spotId','userId', 'review', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['spotId','url','preview']
            }
        ]
    })
    if(!userSpots){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }

    let spotsList = [];

    userSpots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })

    spotsList.forEach(list => {
        let count = 0
        let totalStars = 0
        list.Reviews.forEach(review =>{
        let rating = review.stars
        totalStars += rating
        count++
    })
    avg = totalStars / count
    list.SpotImages.forEach(image => {
        let imageUrl = image.url
        list.previewImage = imageUrl
    })

    list.avgRating = avg
    delete list.Reviews
    delete list.SpotImages
})

    res.json({Spots: spotsList})
})

router.get('/:spotId', async (req,res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include:
        [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ['id','url','preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    })
    if(!spot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }else{
        // const avgStarRating = await Review.findAll(req.params.reviewId)
        // let maxAvg = 5
        // let minAvg = 1

        // avgStarRating.forEach(starRating => {
        //     if(starRating.stars > maxAvg) maxAvg = starRating.stars;
        //     if(starRating.stars < minAvg) minAvg = starRating.stars;
        // })
        // const sumAvg = avgStarRating.reduce((sum, starRating) =>(
        //     sum + starRating.stars
        // ),0);
        const numReviews = await Review.count({
            where: {spotId: spot.id}
        })

        let totalStars = 0
        spot.dataValues.Reviews.forEach((review) => {
            const rating = review.dataValues.stars
            totalStars += rating
        })

            const avg = totalStars / numReviews
            const currSpot = spot.toJSON()
            currSpot.numReviews = numReviews,
            currSpot.avgStarRating = avg
            res.json(currSpot)
    }
})



    router.delete('/:spotId', requireAuth, async (req,res) => {
        const user = req.user.id
        const spot = await Spot.findByPk(req.params.spotId);

        if(!spot){
            return res.status(404).json({message: "Spot couldn't be found"});
        }
        if(user !== spot.ownerId){
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        await spot.destroy();
        return res.json({ message: "Successfully deleted"})
    })

    router.put('/:spotId', requireAuth, validateSpot, async (req,res) => {
        const user = req.user.id
        const updatedSpot = await Spot.findByPk(req.params.spotId)
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        if(!updatedSpot){
            return res.status(404).json({message: "Spot couldn't be found"});
        }
        if(user !== updatedSpot.ownerId){
            return res.status(401).json({ message: 'Invalid credentials'})
        }
        if(address !== undefined){
            updatedSpot.address = address;
        }
        if(city !== undefined){
            updatedSpot.city = city;
        }
        if(state !== undefined){
            updatedSpot.state = state;
        }
        if(country !== undefined){
            updatedSpot.country = country;
        }
        if(lat !== undefined){
            updatedSpot.lat = lat;
        }
        if(lng !== undefined){
            updatedSpot.lng = lng;
        }
        if(name !== undefined){
        updatedSpot.name = name;
        }
        if(description !== undefined){
            updatedSpot.description = description;
        }
        if(price !== undefined){
            updatedSpot.price = price;
        }

    await updatedSpot.save();

    res.json(
        updatedSpot
    )

})

router.post('/', requireAuth, validateSpot , async(req,res,next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id
    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(newSpot)
})

// minLat = parseFloat(minLat);
// maxLat = parseFloat(maxLat);
// minLng = parseFloat(minLng);
// maxLng = parseFloat(maxLng);
// minPrice = parseFloat(minPrice);
// maxPrice = parseFloat(maxPrice);

router.get('/', async (req,res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query


    const queryfilter = {}
    // let { page, size } = req.query
    if(!page) page = 1;
    if(!size) size = 20;
    const pagination = {};
    if(size <= 20 && page <= 10 ) {
        pagination.limit = size
        pagination.offset = (page - 1) * size
    }
    const errors = {};
    if(page < 1 || page > 10 || isNaN(page)) errors.page = "Page must be greater than or equal to 1"
    if(size < 1 || size > 20) errors.size = "Page must be greater than or equal to 1"
    if(minLat && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid"
    if(maxLat && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid"
    if(minLng && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid"
    if(maxLng && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid"
    if(minPrice < 0 && isNaN(minPrice)) errors.minPrice = "Minimum price must be greater than or equal to 0"
    if(maxPrice < 0 && isNaN(maxPrice)) errors.maxPrice = "Maximum price must be greater than or equal to 0"
    if(Object.keys(errors).length > 0) {
        res.status(400).json({
            message: 'Bad Request',
            errors: errors
        })
    }
        const allSpots = await Spot.findAll({

            where:{
                ...queryfilter
            },
            include:[
                {
                    model:Review,
                    attributes: ['id', 'spotId','userId', 'review', 'stars']
                },
                {
                    model: SpotImage,
                    attributes: ['spotId','url','preview']
                }
            ],
            ...pagination
        })
    if(!allSpots){
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    let spotsList = [];
    allSpots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    spotsList.forEach(list => {
        let count = 0
        let totalStars = 0
        list.Reviews.forEach(review =>{
            let rating = review.stars
            totalStars += rating
            count++
        })
        avg = totalStars / count
        list.SpotImages.forEach(image => {
            let imageUrl = image.url
            list.previewImage = imageUrl
        })
        list.avgRating = avg
        delete list.Reviews
        delete list.SpotImages
    })

    page = parseInt(page);
    size = parseInt(size);

    return res.json({Spots: spotsList, page, size})
})



module.exports = router;
