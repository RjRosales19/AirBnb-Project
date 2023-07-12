const express = require('express');
const router = express.Router();
const { ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user =  req.user.id
    const reviewimage = await ReviewImage.findByPk(req.params.imageId);

    if(user === reviewimage.spotId){
        await review.destroy();
        return res.json({message: "Successfully deleted"})
    }
    if(!reviewimage){
        return res.status(404).json({message: "Spot Image couldn't be found"});
    }
    res.status(401).json({ message: 'Invalid credentials'})
})

module.exports = router;
