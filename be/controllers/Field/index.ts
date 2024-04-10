import express from "express";
import * as fieldController from './fieldController'
import * as auth from '../Users/usersController'

const router = express.Router()
router.use(auth.authenticateTokenWithRoles(['USER']))
router.get(('/'), fieldController.getAllFields)
router.put('/', fieldController.createNewField)
router.post('/', fieldController.updateField)

export default router