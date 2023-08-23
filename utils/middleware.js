/* eslint-disable linebreak-style */
require('dotenv').config()
const logger = require('./logger')
const jwt = require('jsonwebtoken')


const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const tokenExtractor = (request, response, next) => {
    // code that extracts the token
    const authorization = request.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token =  authorization.replace('Bearer ', '')

    }
    next()
}

const userExtractor = (request, response, next) => {

    const decoded = jwt.verify(request.token, process.env.SECRET)
    const user = decoded.id.toString()
    request.user = user

    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}