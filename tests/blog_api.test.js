const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }  
]

const user = {
    username: 'ree',
    password: 'reeeeesadjkfaskjdfa'
}

const getTokenForUser = async (user) => {
    const response = await api
        .post('/api/login')
        .send(user) 
        .expect(200)


    
    return response.body.token
}

beforeEach(async () => {
    await Blog.deleteMany({})

    const token =  await getTokenForUser(user)

    const blogCreationPromises = initialBlogs.map(blog => 
        api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201)
    )

    await Promise.all(blogCreationPromises)

}, 20000)


test('blogs are returned as json', async () => {


    const token = await getTokenForUser(user)

    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('there are six notes', async () => {
    const token =  await getTokenForUser(user)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

  
    expect(response.body).toHaveLength(6)
})


test('id named properly', async () => {

    const token =  await getTokenForUser(user)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)

  
    expect(response.body[0].id).toBeDefined()
})  



test('POST creates a post', async () => {
    const count = await Blog.countDocuments({})

    const newBlog = {
        title: 'ree',
        author: 'yee',
        url: 'https://reactpatterns.com/',
        likes: 3
    }

    const token =  await getTokenForUser(user)


    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const newCount = await Blog.countDocuments({})
    expect(newCount).toEqual(count + 1)
})


test('if no likes property, default to zero', async () => {
    await Blog.deleteMany({})

    const newBlog = {
        title: 'ree',
        author: 'yee',
        url: 'https://reactpatterns.com/',
    }

    const token =  await getTokenForUser(user)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)


    expect(response.body[0].likes).toEqual(0)
})


test('if url or title missing, get status 400', async () => {

    const newBlog1 = {
        author: 'yee',
        url: 'https://reactpatterns.com/',
        likes: 3
    }

    const newBlog2 = {
        title: 'ree',
        author: 'yee',
        likes: 3
    }

    const token =  await getTokenForUser(user)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog1)
        .expect(400)
        .expect('Content-Type', /application\/json/)


    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog2)
        .expect(400)
        .expect('Content-Type', /application\/json/)


})


test('delete works as intended', async () => {

    const blogs = await Blog.find({})
    const count = blogs.length
    const id = blogs[0]._id

    const token =  await getTokenForUser(user)

    await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)


    const newCount = await Blog.countDocuments({})


    expect(newCount).toEqual(count - 1)

})

test('put works as intended', async () => {

    const blogs = await Blog.find({})
    const initialTitle = blogs[0].title
    const id = blogs[0].id

    const updatedBlog = {
        title: 'weewee',
        author: blogs[0].author,
        url: blogs[0].url,
        likes: blogs[0].likes
    }
    const token =  await getTokenForUser(user)


    await api
        .put(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlog)
        .expect(200)

    const updatedResult = await Blog.findById(id)


    expect(updatedResult.title).toEqual('weewee')

    expect(initialTitle).not.toEqual(updatedResult.title)

})


afterAll(async () => {
    await Blog.deleteMany({})

    await mongoose.connection.close()
})