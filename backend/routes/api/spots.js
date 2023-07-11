const express = require('express');
const router = express.Router();
const { Spot, User, SpotImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.get('/', async (req,res) => {
    const spots = await Spot.findAll(
    )
    res.json(spots)
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
    // if(!spot){
    //     res.status
    // }
    res.json(spot)
})

router.post('/', requireAuth, async(req,res,next) => {
    const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body

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

router.post('/:id/images', requireAuth, async(req,res,next) => {
    const spotId = req.spot.id
    const spotImage = await SpotImage.create({
        spotId
    })
    res.json(spotImage)
})
module.exports = router;
