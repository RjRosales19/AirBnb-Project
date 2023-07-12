const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js');


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
router.get('/', async (req,res) => {
    const spots = await Spot.findAll(
    )
    res.json(spots)
    return res.json({
        message: "Spot couldn't be found"
    })
})

router.get('/:id', async (req,res) => {
    const spot = await Spot.findByPk(req.params.id, {
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
        .isLength({max:50})
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

router.post('/:id/images', requireAuth, async(req,res) => {
    const spotId = req.params.id
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

router.delete('/:spotId', requireAuth, async (req,res,next) => {
    const user = req.user.id
    const spot = await Spot.findByPk(req.params.spotId);
    console.log(user, spot)

    if(user === spot.ownerId){
        await spot.destroy();
        return res.json({ message: "Successfully deleted"})
    }
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"});
    }
    res.status(401).json({ message: 'Invalid credentials'})
})
module.exports = router;
