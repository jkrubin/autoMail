import express from 'express'
import * as usersController from './usersController'

let router = express.Router()

router.post('/register', usersController.register)

router.post('/login', usersController.login)

export default router