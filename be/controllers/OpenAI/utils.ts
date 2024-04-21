import OpenAI from "openai";
import dotenv from "dotenv"
import { DocType } from "../../models/docType";
import { Field } from "../../models/field";
import { ChatCompletion, ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
dotenv.config()
const OPENAI_MODEL = "gpt-3.5-turbo-0125";

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
})

const generateMessages = (context: string, task: string): ChatCompletionMessageParam[] => {
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
export const categorizeText = async (docTypes: DocType[], text: string): Promise<DocType> => {
    const categoriesFromDocTypes: string[] = docTypes.map((docType) => {
        return `\nCategory: ${docType.get('name')}
                \n\tIdentifier: ${docType.get('snakeName')}
                \n\tDescription: ${docType.get('description')}`
    })
    const context = `Read the Context text, and classify it into one of the following categories. Each category will have a name, an identifier, and a description. Match which description fits the context the best and give the identifier\n${categoriesFromDocTypes}`
    const enumsFromDocTypes = docTypes.map((docType) => docType.get('snakeName'))
    const categorizeTool: ChatCompletionTool = {
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
            },

        }
    }
    const messages: ChatCompletionMessageParam[] = generateMessages(context, text)
    console.log(messages)
    const openAiRes: ChatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: OPENAI_MODEL,
        tools: [categorizeTool],
        tool_choice: {
            type: "function",
            function: {
                name: categorizeTool.function.name
            }
        }
    })
    console.log(openAiRes)
    try{
        const toolCalls = openAiRes?.choices[0]?.message?.tool_calls
        if(toolCalls?.length){
            const categoryJSON = JSON.parse(toolCalls[0].function.arguments)
            const {category} = categoryJSON
            console.log('category is', category)
            const matchingDocument = docTypes.find((doc)=> doc.snakeName === category)
            if(matchingDocument) {
                return matchingDocument
            }else{
                throw new Error(`could not find ${category} in documents`)
            }
        }
        throw new Error(`Assistant did not use tool calls`)
    }catch(err){
        console.log(err)
        throw err
    }
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
    const extractTool: ChatCompletionTool = {
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
    const context = `Read the Context text and extract the following data points from the text, the following is each data point name and description\n${docType.fields.map(field => `\n${field.snakeName} - ${field.description}`)}`

    const messages: ChatCompletionMessageParam[] = generateMessages(context, text)
    const openAiRes: ChatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: OPENAI_MODEL,
        tools: [extractTool],
        tool_choice: {
            type: "function",
            function: {
                name: extractTool.function.name
            }
        }
    })
    console.log(openAiRes)
    try{
        const toolCalls = openAiRes?.choices[0]?.message?.tool_calls
        if(toolCalls?.length){
            const fields = JSON.parse(toolCalls[0].function.arguments)
            console.log('Fields: ',fields)
            return fields
        }
        throw new Error(`Assistant did not use tool calls`)
    }catch(err){
        console.log(err)
        throw err
    }

}