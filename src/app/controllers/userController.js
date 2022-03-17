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

    const { userName } = req.body

    try {

        if (await User.findOne({ userName })) {
            return res.status(400).send({ erro: 'user already exists.' })
        }

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })

    }
    catch (err) {
        return res.status(400).send({ error: 'registration Failed. '})
    }
})

//AUTHENTICAR USER
router.post('/authenticar-user', async (req, res)  =>{

    const { userName, password } = req.body

    const user = await User.findOne({ userName }).select('+password')

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
        const user = await User.findOne({ userName: req.params.userName })
        return res.send({ user })
    }
    catch(err){
        return res.status(400).send({ erro: 'erro in loading data-user' })
    }
})

module.exports = app => app.use('/user', router)