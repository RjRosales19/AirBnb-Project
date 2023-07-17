const express = require('express');
const router = express.Router();
const { Booking, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

//getting empty bookings array even after creating several booking for the current user
router.get('/current', requireAuth, async (req,res) => {
    const user = req.user.id;
    const userSpots = await Booking.findAll({
        where: {
            userId: user
        },
        include: [
            {
                model:Spot,
                attributes: ['id', 'ownerId','address','city','state','country','lat','lng','name','price','previewImage']
            }
        ]
    })
    if(!userSpots){
        res.status(404)
        return res.json({
            message: "No Bookings couldn't be found"
        })
    }
    res.json({Bookings: userSpots})
})

router.put('/:bookingId', requireAuth, async (req, res) => {
    const updatedBooking = await Booking.findByPk(req.params.bookingId)
    const { startDate, endDate } = req.body;
    const user = req.user.id
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
    if(user !== updatedBooking.userId){
        return res.status(401).json({ message: 'Invalid credentials'})
    }
    await updatedBooking.save()
    res.json(
        updatedBooking
    )
})

// providing invalid booking id should have proper error response
router.delete('/:bookingId', requireAuth, async (req,res) => {
    const {startDate } = req.body
    const user =  req.user.id
    const booking = await Booking.findByPk(req.params.bookingId);
    const newDate = Date.now()

    if(!booking){
        return res.status(404).json({message: "Booking couldn't be found"});
    }

    if(new Date(startDate) >= new Date(newDate)){
        return res.status(403).json({message: "Bookings that have been started can't be deleted"})
    }

    if(user === booking.userId){
        await booking.destroy();
        return res.json({message: "Successfully deleted"})
    }else{
        res.status(401).json({ message: 'Invalid credentials'})
    }
})
module.exports = router;
