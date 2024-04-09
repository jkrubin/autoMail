import OpenAI from "openai";
import { DocType } from "../../models/docType";
import { Field } from "../../models/field";
import { ChatMessage } from "./types";
const OPENAI_MODEL = "gpt-3.5-turbo-0125";

// const openai = new OpenAI({
//     apiKey: process.env['OPENAI_API_KEY']
// })

const generateMessages = (context: string, task: string): ChatMessage[] => {
    return [
        {
            role: "system",
            content: "You are a helpful assistant. Your job is to read the content and execute the task given to you."
        },
        {
            role: "user",
            content: `Context:\n${context}`
        },
        {
            role: "user",
            content: `Task\n${task}` 
        }    
    ]
}
export const categorizeText = async (docTypes: DocType[], text: string) => {
    const categoriesFromDocTypes: string[] = docTypes.map((docType) => {
        return `\nCategory: ${docType.get('name')}
                \n\tIdentifier: ${docType.get('snakeName')}
                \n\tDescription: ${docType.get('description')}`
    })
    const context = `Read the Context text, and classify it into one of the following categories. Each category will have a name, an identifier, and a description. Match which description fits the context the best and give the identifier\n${categoriesFromDocTypes}`
    const enumsFromDocTypes = docTypes.map((docType) => docType.get('snakeName'))
    const categorizeTool = {
        type: "function",
        function: {
            name: "create_category",
            description: "Take a text body and categorize it into one of the enumerated categories",
            parameters: {
                type: "object",
                properties: {
                    "category": {
                        type: "string",
                        enum: enumsFromDocTypes,
                        description: "Possible categories for the text"
                    }
                },
                required: ["category"]
            }

        }
    }
    const messages: ChatMessage[] = generateMessages(context, text)
    console.log(messages, categorizeTool)
}

export const extractValuesFromText = async (docType: DocType, text: string) => {
    let parametersJSON: any = {}
    for(let i = 0; i < docType.fields.length; i++) {
        let field: Field = docType.fields[i]
        parametersJSON[field.get('snakeName')] = {
            type: "string",
            description: field.get('description')
        }
    }
    const extractTool = {
        type: "function",
        function: {
            name: docType.get('snakeName'),
            description: docType.get('description'),
            parameters: {
                type: "object",
                properties: parametersJSON,
                required: Object.keys(parametersJSON)
            }
        }
    }
}