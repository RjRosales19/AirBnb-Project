const express = require('express');
const router = express.Router();
const { ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user =  req.user.id
    const reviewimage = await ReviewImage.findByPk(req.params.imageId);

    if(!reviewimage){
        return res.status(404).json({message: "Review Image couldn't be found"});
    }

    if(user === reviewimage.reviewId){
        await reviewimage.destroy();
        return res.json({message: "Successfully deleted"})
    }
    res.status(401).json({ message: 'Invalid credentials'})
})

module.exports = router;
