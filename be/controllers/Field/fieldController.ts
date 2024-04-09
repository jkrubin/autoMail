import { Request, Response } from "express";
import { Field } from "../../models/field";

export const createNewField = async (req: Request, res: Response) => {
    try{
        const newField = await Field.create(req.body)
        return res.send(newField.toJSON())
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
}

export const updateField = async (req: Request, res: Response) => {
    try{
        const {fieldId} = req.params
        const field = await Field.findOne({where: {id: fieldId}})
        if(!field) {
            return res.status(404).send({message: 'No Field Found'})
        }
        return res.send(field.toJSON())
    }catch(err){
        console.log(err)
        return res.status(500).send()
    }
}

export const getAllFields = async (req: Request, res: Response) => {
    try{
        const {userId} = req.body
        const fields = await Field.findAll({where: {userId: userId}})
    }catch(err){
        console.log(err)
        return res.status(500).send()
    }
}