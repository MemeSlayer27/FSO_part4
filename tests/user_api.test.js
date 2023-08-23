const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')



beforeEach(async () => {
    await User.deleteMany({})


}, 10000)


test('post checks that username is long enough', async () => {

    const usernameTooShort = {
        'username': 'li',
        'name': 'Eve',
        'password': 'evepassword'
    }

    await api
        .post('/api/users')
        .send(usernameTooShort)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})


test('post checks that password is long enough', async () => {

    const usernameTooShort = {
        'username': 'lizzie',
        'name': 'Eve',
        'password': 'pi'
    }

    await api
        .post('/api/users')
        .send(usernameTooShort)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})






afterAll(async () => {
    await User.deleteMany({})

    await mongoose.connection.close()
})