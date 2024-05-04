import express from "express";
import * as openAiController from './OpenAiController'
import * as authController from '../Users/usersController'
const router = express.Router()

router.use(authController.authenticateTokenWithRoles(['USER']))
router.post('/', openAiController.processText)
router.put('/extraction/dummy', openAiController.createDummyExtraction)
router.get('/extractions', openAiController.getAllExtractions)
export default router