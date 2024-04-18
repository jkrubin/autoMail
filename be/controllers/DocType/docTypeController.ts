import { Request, Response } from "express";
import { DocType, DocTypeField } from "../../models/docType";
import { Field } from "../../models/field";
import { AuthRequest } from "../Users/usersController";

export const createDocType = async(req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const newDocType = await DocType.create({...req.body, userId: user?.id});
        return res.send(newDocType.toJSON())
    }catch(e) {
        console.log(e);
        return res.status(500).send()
    }
}

export const getDocTypes = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const docTypes = await DocType.findAll({where: {userId: user?.id}, include:[Field]});
        const docTypesRes = docTypes.map((docType) => {
            const modifiedDocyType = docType.toJSON();
            //ToDo: More mod if needed
            modifiedDocyType.fields = docType.fields.map(field => field.id)
            return modifiedDocyType
        })
        return res.send(docTypesRes)
    }catch(e){
        console.log(e)
        return res.status(500).send()
    }
}

export const getDocType = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {docTypeId} = req.params
        const docType = await DocType.findOne({where: {id: docTypeId, userId: user?.id}, include: [Field]});
        if(!docType){
            return res.status(404).send();
        }

        const docTypeJSON = docType.toJSON();
        return res.send(docTypeJSON);
    }catch(e) {
        console.log(e)
        return res.status(500).send()
    }
}

export const updateDocType = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {docTypeId} = req.params
        const docType = await DocType.findOne({where: {id: docTypeId, userId: user?.id}})
        if(!docType){
            return res.status(404).send({message: "Unable to find Document Type"})
        }
        await docType.update(req.body)

        return res.send(docType.toJSON())
    }catch(e){ 
        console.log(e);
        return res.status(500).send()
    }
}

export const linkFieldToDoc = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {docTypeId, fieldId} = req.params
        const docType = await DocType.findOne({where: {id: docTypeId, userId: user?.id}})
        const field = await Field.findOne({where: {id: fieldId, userId: user?.id}})
        if(!docType || !field) {
            return res.status(404).send({message: 'Could not find docType and Field combo'})
        }
        await DocTypeField.create({docTypeId: docType.get('id'), fieldId: field.get('id')})
        return res.send()
    }catch(err){
        return res.status(500).send()
    }
}

export const unlinkFieldToDoc = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {docTypeId, fieldId} = req.params
        const docTypeField = await DocTypeField.findOne({where: {docTypeId: docTypeId, fieldId: fieldId, userId: user?.id}})
        if(!docTypeField) {
            return res.status(404).send({message: 'Could not find docType and Field combo'})
        }
        await docTypeField.destroy()
        return res.send()
    }catch(err){
        return res.status(500).send()
    }
}