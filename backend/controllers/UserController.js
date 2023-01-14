const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-token')
const createUsertoken = require('../helpers/create-user-token')
const getUserByToken = require('../helpers/get-user-by-token')
const Pet = require('../models/Pet')

module.exports = class UserController {

    static async register(req, res) {

        /*
        metodo hard code
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        */

        const { name, email, phone, password, confirmpassword } = req.body

        //validations
        if (!name) {
            res.status(422).json({ message: 'o nome é obrigatorio' })
        }

        if (!email) {
            res.status(422).json({ message: 'o email é obrigatorio' })
        }

        if (!phone) {
            res.status(422).json({ message: 'o telefone é obrigatorio' })
        }

        if (!password) {
            res.status(422).json({ message: 'a senha  é obrigatorio' })
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'a confirmação de senha é obrigatorio' })
        }

        if (password !== confirmpassword) {
            res.
                status(422).
                json({
                    message: "A senha e confirmação de senha precisam ser iguais"
                })
            return
        }

        //check if user exists

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.
                status(422).
                json({
                    message: "Ja existe um usuário cadastrado com esse email faça login ou utilize outro e-mail"
                })
            return
        }


        // create a password
        const salt = await bcrypt.genSalt(12)

        const passwordHash = await bcrypt.hash(password, salt)

        //create a user

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {

            const newUser = await user.save()

            await createUsertoken(newUser, req, res)

            //return

        } catch (err) {
            res.status(500).json({ message: err })
        }

    }


    static async login(req, res) {

        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O e-mail e obrigatório' })
            return
        }


        if (!password) {
            res.status(422).json({ message: 'A senha e obrigatória' })
            return
        }


        //check if user exists

        const user = await User.findOne({ email: email })

        if (!user) {
            res.
                status(422).
                json({
                    message: "não ha usuario cadastrado com esse e-mail"
                })
            return
        }

        //check password match if db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.
                status(422).
                json({
                    message: "senha invalida"
                })
            return
        }
        await createUsertoken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        if (req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(422).json({
                message: 'Usuario não encontrado',
            })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {

        const { name, email, phone, image, password, confirmpassword } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)


        if (req.file) {
          user.image = req.file.filename
        }

        if(!name){
            return res.status(422).json({ message: 'O nome é obrigatorio'})
        }

        user.name = name

        if(!email){
            return res.status(422).json({ message: 'O e-mail é obrigatorio'})
        }

        // verify if exists email in bd

       // const userExists = await User.findOne({ email: email })

      //  if(user.email !== email && userExists){
        /*
        if(userExists){
            res.status(422).json({
                message: "Por favor utilize outro e-mail ja em uso"
            })
            return
        }
        */
        user.email = email

        if(!phone){
            return res.status(422).json({ message: 'O telefone é obrigatorio'})
        }

        user.phone = phone
 
        
        if(!password){
            return res.status(422).json({ message: 'O password é obrigatorio'})
        }

        user.password = password

        if(!confirmpassword){
            return res.status(422).json({ message: 'A confirmação de password é obrigatorio'})
        }

        if(confirmpassword != password){
            return res.status(422).json({ message: 'A senha precisa ser igual'})
        }else if(password === confirmpassword && password != null){

                // create a password
                const salt = await bcrypt.genSalt(12)

                const passwordHash = await bcrypt.hash(password, salt)

            //creating password
        //    const salt = await bcrypt.salt(12)
         //   const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        user.confirmpassword = confirmpassword

        try{

            // return user updatte data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )


            res.status(200).json({
                message: "Usuario atualizado com sucesso"
            })

         

        }catch(err){
            res.status(500).json({message: err})
            return
        }
  


    }

    static async getAllUserAdoptions(req,res){
        
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find( { 'adopter._id' : user._id}).sort('-createdAt')

        res.status(200).josn({
            pets,
        })
    }

}