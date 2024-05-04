import { Request, Response } from "express";
import { DocType } from "../../models/docType";
import { categorizeText, extractValuesFromText } from "./utils";
import { Field } from "../../models/field";
import { Extraction } from "../../models/extraction";
import { AuthRequest } from "../Users/usersController";

export const processText = async (req: AuthRequest, res: Response) => {
    const {user} = req
    const {text} = req.body
    const docTypes = await DocType.findAll({where: {userId: user?.id}, include: [Field]})
    if(!docTypes.length){
        return res.status(404).send()
    }
    try{
        let matchingDocType = await categorizeText(docTypes, text)
        if(!matchingDocType){
            throw new Error(`Could not match doctype with ID found`)
        }
        const extractionRes = await extractValuesFromText(matchingDocType, text)
        console.log(extractionRes)
        const extractionJSON = {
            document: matchingDocType.name,
            data: extractionRes
        }
        console.log(extractionJSON)
        const extraction = await Extraction.create({
            userId: user?.id,
            text,
            extractedJSON: JSON.stringify(extractionJSON)
        })
        return res.send(extraction.toJSON())
    }catch(e){
        return res.status(500).send({message: e})
    }
}

export const createDummyExtraction = async (req: AuthRequest, res: Response) => {
    try{
        const {user} = req
        const {text, extractedJSON} = req.body
        const stringifiedJSON = typeof extractedJSON === 'string'? 
            extractedJSON
            :
            JSON.stringify(extractedJSON)


        const dummyExtraction = await Extraction.create({text, extractedJSON: stringifiedJSON, userId: user?.id})
        return res.send(dummyExtraction)
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Server error creating dummy extraction'})
    }
}

export const getAllExtractions = async (req:AuthRequest, res: Response) => {
    try{
        const {user} = req
        const extractions = await Extraction.findAll({where: {userId: user?.id}})
        return res.send(extractions)
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Server error fetching extractions'})
    }
}