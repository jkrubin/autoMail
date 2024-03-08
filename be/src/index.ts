import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import cors from "cors"
import { sequelize } from "./sequelize";
import router from './routes'
dotenv.config()


const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.port || 8080;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world")
})

app.use('/v1', router)


sequelize.sync({force: true}).then(()=>{
    app.listen(port, () => {
        console.log(`Server is now listening on port ${port}`)
    })
})
