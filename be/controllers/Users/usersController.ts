import { NextFunction, Request, Response } from "express";
import { Permission, PermissionRole, User, UserPermission } from "../../models/user";
import jwt, { Secret, JwtPayload, Jwt } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'dev'

export interface AuthRequest extends Request {
    user?: User;
}

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

export const authenticateTokenWithRoles = (roles: PermissionRole[] = []) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = req.headers['x-access-token'] as any as string
    
        if(!token) {
            return res.status(401).send({auth: false, message: 'You are not logged in'})
        }
        jwt.verify(token, JWT_SECRET, async (err, decodedUser:any) => {
            console.log('decoded user:', decodedUser)
            if(err){
                return res.status(500).send({message: "Your login session has expired"})
            }else{
                const user = await User.findOne({where: {id: decodedUser?.id}, include: [Permission]})
                if(!user) {
                    return res.status(500).send({message: "No matching user found"})
                }
                if(!roles?.length || user.permissions.some(permission => roles.includes(permission.role))){
                    req.user = user
                    next();
                }else{
                    return res.status(403).send({message: "You do not have permission to do this"})
                }
    
            }
        })
    }
}

export const createRole = async(req: Request, res: Response) => {
    const {role} = req.body
    try{
        const permission = await Permission.create({role: role})
        return res.send(permission.toJSON())
    }catch(err){
        return res.sendStatus(500)
    }
}

export const giveUserRole = async(req: Request, res: Response) => {
    const {permissionId, userId} = req.body
    try{
        const user = await User.findByPk(userId);
        const permission = await Permission.findByPk(permissionId)
        if(!user || !permission){
            return res.sendStatus(404)
        }
        await UserPermission.create({userId, permissionId})
        res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}