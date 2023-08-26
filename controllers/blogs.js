/* eslint-disable linebreak-style */
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()





blogRouter.get('/', async (request, response, next) => {

    try {
        const blogs = await Blog.find({}).populate('user')
        return response.status(200).json(blogs)
    } catch (error) {
        next(error)
    }


})
  
blogRouter.post('/', async (request, response, next) => {


    const body = request.body.likes === undefined
        ? {...request.body, likes: 0}
        : request.body



    if (body.url === undefined || body.title === undefined) {
        return response.status(400).json({error: 'bad request'})
    }


    try {

        if (!request.user) {
            return response.status(401).json({ error: 'token invalid' })
        }

        
        const blog = new Blog({ ...body, user: request.user })


        const savedBlog = await blog.save()
        const blogToReturn = await savedBlog.populate('user')
        response.status(201).json(blogToReturn)
    } catch (error) {
        next(error)
    }
})


blogRouter.delete('/:id', async (request, response, next) => {

    const postID = request.params.id
    try {

        const blog = await Blog.findById(postID)

        if (blog.user.toString() === request.user) {
            await Blog.findByIdAndDelete(postID)
            return response.status(200).end()
        } else {
            return response.status(400).json({ error: 'not authorized'})
        }


    } catch (error) {
        next(error)
    }
})


blogRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    const updatedData = request.body

    try {
        await Blog.findByIdAndUpdate(id, updatedData, { new: true })
        return response.status(200).end()
    } catch (error) {
        next(error)
    }
})


module.exports = blogRouter
