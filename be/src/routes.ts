import express, { Express } from "express";
import userRouter from '../controllers/Users'

const app = express()

app.use('/auth', userRouter)

export default app
