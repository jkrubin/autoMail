import express from "express";
import * as fieldController from './fieldController'

const router = express.Router()

router.get('/', fieldController.getAllFields)
router.put('/', fieldController.createNewField)
router.post('/', fieldController.updateField)

export default router