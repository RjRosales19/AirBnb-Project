const express = require('express');
const router = express.Router();
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.get('/current', requireAuth, async (req,res) => {
    const user = req.user.id;
    const userReviews = await Review.findAll({
        where: {
            userId : user
        },
        // include: [
        //     {
        //         model:User,
        //         attributes: ['id','firstName','lastName']
        //     },
        //     {
        //         model:Spot,
        //         attributes: ['id', 'ownerId','address','city','state','country','lat','lng','name','price','previewImage']
        //     },
        //     {
        //         model:ReviewImage,
        //         attributes: ['id','url']
        //     }
        // ]
    })
    if(!userReviews){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found"
        })
    }
    res.json(userReviews)
})


module.exports = router;
