const router = require('express').Router()

const PetController = require('../controllers/PetController.js')

// middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')


router.patch('/schedule/:id' , verifyToken, PetController.schedule )

router.get('/myadoptions' , verifyToken , PetController.getAllUserAdoptions )
router.get('/mypets' , verifyToken , PetController.getAllUserPets)
router.post('/create', verifyToken, imageUpload.array('images') , PetController.create)
router.get('/:id' , PetController.getPetById )
router.delete('/:id', verifyToken , PetController.removePetById)
router.patch('/:id' , verifyToken, imageUpload.array('images') , PetController.updatePet)

router.get('/' , PetController.getAll)

module.exports = router