/* eslint-disable linebreak-style */
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        required: true,
        unique: true,
        validate: {
            validator: v => {
                return v.length >= 3
            }
        },
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    name: String,
    passwordHash: String
})


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.passwordHash
        delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('User', userSchema)