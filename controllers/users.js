
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs')

        return response.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/', async (request, response, next) => {
    try {
        const {username, name, password } = request.body

        if (password.length < 3) {
            return response.status(400).json({ error: 'password too short' })
        }

        if (username.length < 3) {
            return response.status(400).json({ error: 'username too short' })
        }

        const users = await User.find({ username: username })

        if (users.length > 0) {
            return response.status(400).json({ error: 'username must be unique' })
        }


        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds) 


        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)

    } catch (error) {
        next(error)
    }
})

module.exports = userRouter