import express from "express";
import * as openAiController from './OpenAiController'

const router = express.Router()

router.post('/', openAiController.processText)

export default router