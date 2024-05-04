import React, { useState } from "react"
import { useApi } from "../utils"
import { Extraction } from "./types"


export const useExtractions = () => {
    const {fetchAPI} = useApi()
    const [extractions, setExtractions] = useState<Extraction[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const getExtractions = async() => {
        try{
            setIsLoading(true)
            const fieldsRes = await fetchAPI<Extraction[]>('process/extractions')
            setExtractions(fieldsRes)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
        }
    }

    const processData = async(text: string) => {
        setIsLoading(true)
        try{
            const extraction = await fetchAPI<Extraction>('process', {
                method: 'POST',
                body: JSON.stringify({
                    text: text
                })
            })
            setExtractions((prevState) => [...prevState, extraction])
            return extraction.id
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }

    return {
        extractions,
        isLoading,
        error,
        actions: {
            getExtractions,
            processData
        }
    }
}