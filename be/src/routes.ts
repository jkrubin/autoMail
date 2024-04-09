import express, { Express } from "express";
import userRouter from '../controllers/Users'
import docTypeRouter from '../controllers/DocType'
import fieldRouter from '../controllers/Field'
import OpenAiRouter from '../controllers/OpenAI'

const app = express()

app.use('/auth', userRouter)
app.use('/docType', docTypeRouter)
app.use('/field', fieldRouter)
app.use('/process', OpenAiRouter)
export default app
