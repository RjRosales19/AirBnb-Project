const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage, Review, Booking} = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');

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

router.post('/:spotId/reviews', requireAuth, async (req,res) => {
    const spotId = req.params.spotId
    const review = await Review.create({
        spotId,
        review,
        stars,
    })
    if(!spotId){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json(review)
})

router.get('/:spotId/reviews', async (req,res) => {
    const spot = req.spot.id
    const reviews = await Review.findAll({
        where: {
            spotId: spot
        }
    })
    if(!reviews){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json(reviews)
})

router.get('/:spotId/bookings', requireAuth, async(req,res) => {
    const spotId = req.params.spotId
    const bookings = await Booking.findAll()
    if(!spotId){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json(bookings)
})

router.post('/:spotId/bookings', requireAuth, async(req,res) => {
    const spotId = req.params.spotId
    const booking = await Booking.create({
        spotId
    })
    if(!spotId){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
        res.json(booking)
})

router.post('/:spotId/images', requireAuth, async(req,res) => {
    const user = req.user.id
    const spotId = req.params.spotId
    const {url, preview } = req.body
    const owner = spotId.ownerId
    if(user !== owner) {
        res.status(403)
    }
    const spotImage = await SpotImage.create({
        spotId
    })
    if(!spotId){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
        }
        res.json(spotImage)
    })

router.get('/current', requireAuth, async (req,res) => {
    const user = req.user.id;
    const userSpots = await Spot.findAll({
        where: {
            ownerId: user
        }
    })
    if(!userSpots){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json(userSpots)
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
    res.json(spot)
})



    router.delete('/:spotId', requireAuth, async (req,res) => {
        const user = req.user.id
        const spot = await Spot.findByPk(req.params.spotId);

        if(!spot){
            return res.status(404).json({message: "Spot couldn't be found"});
        }
        if(user === spot.ownerId){
            await spot.destroy();
            return res.json({ message: "Successfully deleted"})
        }
        res.status(401).json({ message: 'Invalid credentials'})
    })

    router.put('/:spotId', requireAuth, async (req,res) => {
        const updatedSpot = await Spot.findByPk(req.params.spotId)
        const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body

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

    res.json({
        updatedSpot
    })

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
    res.json(newSpot)
})

router.get('/', async (req,res) => {
    const spots = await Spot.findAll()
        res.json({Spots: spots})
        return res.json({
            message: "Spot couldn't be found"
        })
    })



    module.exports = router;
