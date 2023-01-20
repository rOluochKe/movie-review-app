const express = require('express')
const { createActor, updateActor, deleteActor, searchActor, getLatestActors, getSingleActor } = require('../controllers/actor')
const { uploadImage } = require('../middlewares/multer')
const { actorInfoValidator, validate } = require('../middlewares/validator')

const router = express.Router()

router.post('/create', uploadImage.single('avatar'), actorInfoValidator, validate, createActor)
router.put('/update/:actorId', uploadImage.single('avatar'), actorInfoValidator, validate, updateActor)
router.delete('/:actorId', deleteActor)
router.get('/search', searchActor)
router.get('/latest-uploads', getLatestActors)
router.get('/single/:id', getSingleActor)

module.exports = router