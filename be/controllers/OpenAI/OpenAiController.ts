import { Request, Response } from "express";
import { DocType } from "../../models/docType";
import { categorizeText } from "./utils";

export const processText = async (req: Request, res: Response) => {
    const {text, userId} = req.body
    const docTypes = await DocType.findAll({where: {userId: userId}})
    if(!docTypes.length){
        return res.status(404).send()
    }
    let openAiRes = await categorizeText(docTypes, text)
    return res.send(openAiRes)
}