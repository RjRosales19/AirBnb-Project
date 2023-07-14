const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');
const { Sequelize } = require('sequelize');

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
        .isLength({max:49})
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Price per day is required"),
        handleValidationErrors
    ];


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
    res.json({Reviews: reviews})
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
    if(startDate >= endDate){
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
    })
    const avgStarRating = await Review.findAll(req.params.reviewId)
    let maxAvg = 5
    let minAvg = 1

    avgStarRating.forEach(starRating => {
        if(starRating.stars > maxAvg) maxAvg = starRating.stars;
        if(starRating.stars < minAvg) minAvg = starRating.stars;
    })
    const sumAvg = avgStarRating.reduce((sum, starRating) =>(
        sum + starRating.stars
    ),0);
    const avg = sumAvg / avgStarRating.length

    if(!userSpots){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    const data = {avg};
    data.userSpots = {
                id: userSpots.id,
                ownerId: userSpots.ownerId,
                address: userSpots.address,
                city: userSpots.city,
                state: userSpots.state,
                country: userSpots.country,
                lat: userSpots.lat,
                lng: userSpots.lng,
                name: userSpots.name,
                description: userSpots.description,
                price: userSpots.price,
                numReviews: userSpots.numReviews,
                avgStarRating: userSpots.avg
    }
    res.json(data)
})

router.get('/:spotId', async (req,res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include:
        [
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
    }
    else{
        const avgStarRating = await Review.findAll(req.params.reviewId)
        let maxAvg = 5
        let minAvg = 1

        avgStarRating.forEach(starRating => {
            if(starRating.stars > maxAvg) maxAvg = starRating.stars;
            if(starRating.stars < minAvg) minAvg = starRating.stars;
        })
        const sumAvg = avgStarRating.reduce((sum, starRating) =>(
            sum + starRating.stars
        ),0);
        const avg = sumAvg / avgStarRating.length
        const numReviews = await Review.count({
            where: {spotId: spot.id}
        })
            const data = {avg, numReviews}
            data.spot = {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                numReviews: spot.numReviews,
                avgStarRating: spot.avg
            }
            res.json(data)
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
        if(user !== updatedSpot.ownerId){
            return res.status(401).json({ message: 'Invalid credentials'})
        }
        if(!updatedSpot){
            return res.status(404).json({message: "Spot couldn't be found"});
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

router.get('/', async (req,res) => {
    const spots = await Spot.findAll({
        include:[
            {
                model:Review,
                attributes: ['id', 'spotId','userId', 'review', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['spotId','url','preview']
            }
        ]
    })
    let spotsList = [];
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })
    let numReviews = 0
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(spotImage => {
            if(spotImage.previewImage === true){
                spot.previewImage = spotImage.url
            }
        })
    })
    res.json(spotsList)

    if(!spots){
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json({Spots: spots})
})

router.get('/', async (req, res) => {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
    let queryObj = {
        order: [['spot', 'ASC']],
        where: {},
        include: []
    }

    if(!page) page = 1
    if(!size) size = 20

    if(size >= 1 && page >=1 ) {
        queryObj.limit = size
        queryObj.offset = (page - 1) * size
    }

})


module.exports = router;
