import { Request, Response } from "express";
import { Field } from "../../models/field";
import { AuthRequest } from "../Users/usersController";

export const createNewField = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const newField = await Field.create({...req.body, userId: user?.id})
        return res.send(newField.toJSON())
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
}

export const updateField = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {fieldId} = req.params
        const field = await Field.findOne({where: {id: fieldId, userId: user?.id}})
        if(!field) {
            return res.status(404).send({message: 'No Field Found'})
        }
        await field.update(req.body)
        return res.send(field.toJSON())
    }catch(err){
        console.log(err)
        return res.status(500).send()
    }
}

export const getAllFields = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const fields = await Field.findAll({where: {userId: user?.id}})
        return res.send(fields)
    }catch(err){
        console.log(err)
        return res.status(500).send()
    }
}

export const deleteField = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {fieldId} = req.params
        const field = await Field.findOne({where: {id: fieldId, userId: user?.id}})
        await field?.destroy()
        return res.status(200).send({message: 'OK'})
    }catch(err){
        return res.status(500).send({message: 'unable to delete field'})
    }
}