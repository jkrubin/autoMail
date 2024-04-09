import { Request, Response } from "express";
import { DocType, DocTypeField } from "../../models/docType";
import { Field } from "../../models/field";

export const createDocType = async(req: Request, res: Response) => {
    try{
        const newDocType = await DocType.create(req.body);
        return res.send(newDocType.toJSON())
    }catch(e) {
        console.log(e);
        return res.status(500).send()
    }
}

export const getDocTypes = async (req: Request, res: Response) => {
    try{
        const {userId} = req.body
        const docTypes = await DocType.findAll({where: {userId: userId}, include:[Field]});
        const docTypesRes = docTypes.map((docType) => {
            const modifiedDocyType = docType.toJSON();
            //ToDo: More mod if needed
            return modifiedDocyType
        })
        return res.send(docTypesRes)
    }catch(e){
        console.log(e)
        return res.status(500).send()
    }
}

export const getDocType = async (req: Request, res: Response) => {
    try{
        const {userId} = req.body
        const {docTypeId} = req.params
        const docType = await DocType.findOne({where: {id: docTypeId, userId: userId}, include: [Field]});
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

export const updateDocType = async (req: Request, res: Response) => {
    try{
        const {userId} = req.body
        const {docTypeId} = req.params
        const docType = await DocType.findOne({where: {id: docTypeId, userId: userId}})
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

export const linkFieldToDoc = async (req: Request, res: Response) => {
    try{
        const {docTypeId, fieldId} = req.params
        const docType = await DocType.findByPk(docTypeId)
        const field = await Field.findByPk(fieldId)
        if(!docType || !field) {
            return res.status(404).send({message: 'Could not find docType and Field combo'})
        }
        await DocTypeField.create({docTypeId: docType.get('id'), fieldId: field.get('id')})
        return res.send()
    }catch(err){
        return res.status(500).send()
    }
}

export const unlinkFieldToDoc = async (req: Request, res: Response) => {
    try{
        const {docTypeId, fieldId} = req.params
        const docTypeField = await DocTypeField.findOne({where: {docTypeId: docTypeId, fieldId: fieldId}})
        if(!docTypeField) {
            return res.status(404).send({message: 'Could not find docType and Field combo'})
        }
        await docTypeField.destroy()
        return res.send()
    }catch(err){
        return res.status(500).send()
    }
}