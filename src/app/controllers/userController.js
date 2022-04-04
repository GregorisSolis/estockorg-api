const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

//I use it to protect the route of obtaining the user data
const authMiddleware = require('../middlewares/auth')


const authConfig = require('../../config/auth.json')
const User = require('../models/user')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

const router = express.Router()

//CREATE USER
router.post('/new-user', async (req, res) => {

    const { username } = req.body

    try {

        if (await User.findOne({ username })) {
            return res.status(400).send({ erro: 'user already exists...' })
        }

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })

    }
    catch (err) {
        return res.status(400).send({ error: 'registration Failed. ' + err})
    }
})

//AUTHENTICAR USER
router.post('/authenticar-user', async (req, res)  =>{

    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password')

    if(!user){
        return res.status(400).send({ error: 'User not found' })
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: 'Invalid password.' })
    }

    user.password = undefined

    res.send({
        user,
        token: generateToken({ id: user.id})
    })

})

//SHOW DATA OF USER
router.use(authMiddleware)

router.get('/data-user/:userName', async (req,res) =>{

    try{
        const user = await User.findOne({ username: req.params.userName })
        return res.send({ user })
    }
    catch(err){
        return res.status(400).send({ erro: 'erro in loading data-user' })
    }
})

//UPDATE USER
router.put('/update-user/:userID', async (req,res) => {

    const { username } = req.body

    try{

        if (await User.findOne({ username })) {
            return res.status(400).send({ erro: 'user already exists.' })
        }

        const user = await User.findByIdAndUpdate(req.params.userID,{...req.body},{new: true})
        return res.send({ user })

    }
    catch(err){
        return res.status(400).send({ erro: 'erro in update-user.'})
    }
})

//RESET PASSWORD USER
router.put('/reset-password/:userID', async (req,res) => {

    const { password } = req.body

    try{

            const user = await User.findById(req.params.userID).select('+password')

            if(!user){
                res.status(400).send({ erro: 'user not found.' })
            }

            user.password = password

            await user.save()

            res.send({ user })

    }
    catch(err){
        return res.status(400).send({ erro: 'error in reset-password'})
    }
})

//DELETE USER
router.delete('/delete-user/:userID', async (req, res) =>{
    try{

        await User.findByIdAndRemove(req.params.userID)
        return res.send({ message: "User deleted."})

    }catch(err){
        return res.status(400).send({ erro: 'erro in delete-user' })
    }
})

module.exports = app => app.use('/user', router)