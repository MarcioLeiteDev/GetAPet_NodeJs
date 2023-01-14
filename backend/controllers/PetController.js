const Pet = require('../models/Pet')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class PetController{

    //create a pet
    static async create(req,res){

        const { name, age, weight , color } = req.body

        const images = req.files

        const avaliable = true

        // upload images


        // validation
        if(!name){
            res.status(402).json({ message: "O nome é obrigatorio"})
            return
        }
        if(!age){
            res.status(402).json({ message: "A idade é obrigatorio"})
            return
        }
        if(!weight){
            res.status(402).json({ message: "O peso é obrigatorio"})
            return
        }
        if(!color){
            res.status(402).json({ message: "A cor é obrigatorio"})
            return
        }

        if(images.lenght === 0){
            res.status(402).json({ message: "A imagem é obrigatorio"})
            return
        }

        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            avaliable,
            images: [],
            user : {
                _id : user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }


        })

        
        images.map((image) => {
            pet.images.push(image.filename)
        })

        try{

            const newPet = await pet.save()
            res.status(201).json({ message: "Pet cadastrado com sucesso" , newPet })
            return

        }catch( error){
            res.status(500).json({ message: error})
        }

        res.json( {message: "Deu Certo"} )
    }

    static async getAll(req,res){
       const pets = await Pet.find().sort('-created_at')

       res.status(200).json({
        pets: pets,
       })

    }

      // get all user pets
  static async getAllUserPets(req, res) {
    // get user
    const token = getToken(req)
    const user = await getUserByToken(token)

    const pets = await Pet.find({ 'user._id': user._id })

    res.status(200).json({
      pets,
    })
  }

    static async getAllUserAdoptions(req,res){

        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id' : user._id }).sort('-created_at')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById( req, res){
       
 


        console.log("estou aqui")
    }
}