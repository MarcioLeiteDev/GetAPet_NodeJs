const router = require('express').Router()

const PetController = require('../controllers/PetController.js')

// middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')


router.get('/myadoptions' , verifyToken , PetController.getAllUserAdoptions )
router.get('/mypets' , verifyToken , PetController.getAllUserPets)
router.post('/create', verifyToken, imageUpload.array('images') , PetController.create)
router.post('/:id' , PetController.getPetById )
router.get('/' , PetController.getAll)

module.exports = router