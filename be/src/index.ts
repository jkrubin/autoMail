import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import cors from "cors"
import { sequelize } from "./sequelize";
import router from './routes'
import path from "path";
import { Permission } from "../models/user";
import { seedRoles } from "../controllers/Users/usersController";
dotenv.config()


const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.port || 8080;


app.use('/v1', router)

app.use(express.static(path.join(__dirname, 'dist')))
app.use("/", async(req, res) => {
    console.log(req.url)
    const serve = path.join(__dirname, 'dist', 'index.html')
    console.log(serve)
    res.sendFile(serve)
})
const seedAndStart = async() => {
    await sequelize.sync()
    await seedRoles()
    app.listen(port, () => {
        console.log(`Server is now listening on port ${port}`)
    })
}

seedAndStart()
