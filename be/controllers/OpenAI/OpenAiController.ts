import { Request, Response } from "express";
import { DocType } from "../../models/docType";
import { categorizeText, extractValuesFromText } from "./utils";
import { Field } from "../../models/field";

export const processText = async (req: Request, res: Response) => {
    const {text, userId} = req.body
    const docTypes = await DocType.findAll({where: {userId: userId}, include: [Field]})
    if(!docTypes.length){
        return res.status(404).send()
    }
    try{
        let matchingDocType = await categorizeText(docTypes, text)
        if(!matchingDocType){
            throw new Error(`Could not match doctype with ID found`)
        }
        const extractionRes = await extractValuesFromText(matchingDocType, text)
        for(let i = 0; i < matchingDocType.fields.length; i++ ){
            
        }
        return res.send(extractionRes)
    }catch(e){
        return res.status(500).send({message: e})
    }
}