import { Request, Response } from "express";
import { User } from "../../models/user";
import jwt, { Secret, JwtPayload, Jwt } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dev'

const getUserInfo = (user: User) => {
    const {id, email, password} = user.toJSON()
    return {id, email, password}
}
const signUser = (user: User) => {
    const userJSON = getUserInfo(user)
    console.log('user info', userJSON)
    return jwt.sign(getUserInfo(user), JWT_SECRET, {expiresIn: '2 days'})
}

export const register = async(req: Request, res: Response) => {
    const {email, password} = req.body
    const existingUser = await User.findOne({where: {email: email}})
    if(existingUser){
        return res.status(409).send({message: "an account already exists with this email"})
    }
    let newUser = await User.create({email, password})
    const jwt = signUser(newUser)
    console.log(jwt)
    newUser = await newUser.update({jwt})
    return res.send(newUser.toJSON());
}

export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body
    let user = await User.findOne({where: {email}})
    if(!user){
        return res.status(403).send({message: 'No Account found with this email'})
    }
    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid){
        return res.status(403).send({message: 'Incorrect password'})
    }
    user = await user.update({jwt: signUser(user)})
    return res.send(user.toJSON())

}