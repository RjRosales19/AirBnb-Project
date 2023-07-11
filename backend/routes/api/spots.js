const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.get('/', async (req,res) => {
    const spots = await Spot.findAll(
    )
    res.json(spots)
})

router.get('/:id', async (req,res) => {
    const spot = await Spot.findByPk(req.params.id, {
        include: {
            
        }
    })
})
module.exports = router;
