const express = require('express');
const router = express.Router();
const { SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user =  req.user.id
    const spotimage = await SpotImage.findByPk(req.params.imageId);

    if(!spotimage){
        return res.status(404).json({message: "Spot Image couldn't be found"});
    }

    if(user === spotimage.spotId){
        await spotimage.destroy();
        return res.json({message: "Successfully deleted"})
    }
    res.status(401).json({ message: 'Invalid credentials'})
})

module.exports = router;
