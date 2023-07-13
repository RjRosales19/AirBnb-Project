const express = require('express');
const router = express.Router();
const { Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.get('/current', requireAuth, async (req,res) => {
    const user = req.user.id;
    const userSpots = await Booking.findAll({
        where: {
            spotId: user
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

router.put('/:bookingId', requireAuth, async (req, res) => {
    const updatedBooking = await Booking.findByPk(req.params.bookingId)
    const { startDate, endDate } = req.body;

    if(!updatedBooking){
        return res.status(404).json({message: "Booking couldn't be found"})
    }
    if(startDate > endDate){
        return res.status(400).json({message: "Bad Request", errors: { endDate:"endDate cannot come before startDate" }})
    }
    if(startDate !== undefined){
        updatedBooking.startDate = startDate;
    }
    if(endDate !== undefined){
        updatedBooking.endDate = endDate;
    }
    await updatedBooking.save()
    res.json({
        updatedBooking
    })
})

router.delete('/:bookingId', requireAuth, async (req,res) => {
    const user =  req.user.id
    const booking = await Booking.findByPk(req.params.bookingId);

    if(!booking){
        return res.status(404).json({message: "Booking couldn't be found"});
    }
    if(user === booking.bookingId){
        await booking.destroy();
        return res.json({message: "Successfully deleted"})
    }
    res.status(401).json({ message: 'Invalid credentials'})
})
module.exports = router;
