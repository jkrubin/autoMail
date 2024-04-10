import express from 'express'
import * as usersController from './usersController'

let router = express.Router()

router.post('/register', usersController.register)
router.post('/login', usersController.login)
router.put('/role', usersController.createRole)
router.post('/role', usersController.giveUserRole)

export default router