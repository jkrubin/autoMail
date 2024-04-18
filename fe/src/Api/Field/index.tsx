import React, { useState } from "react"
import { useApi } from "../utils"
import { Field } from "./types"

// router.get(('/'), fieldController.getAllFields)
// router.put('/', fieldController.createNewField)
// router.post('/', fieldController.updateField)

export const useField = () => {
    const {fetchAPI} = useApi()
    const [fields, setFields] = useState<Field[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const getAllFields = async() => {
        try{
            setIsLoading(true)
            const fields = await fetchAPI<Field[]>('field')
            setFields(fields)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
        }
    }

    const createField = async(field: Field) => {
        setIsLoading(true)
        try{
            const newField = await fetchAPI<Field>('field', {
                method: 'POST',
                body: JSON.stringify(field)
            })
            setFields((prevState) => [...prevState, newField])
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }
    const updateField = async(field: Field) => {
        try{
            setIsLoading(true)
            const updatedField = await fetchAPI<Field>(`field/${field.id}`,{
                method: 'POST',
                body: JSON.stringify(field)
            })
            setFields((prevState) => prevState.map((field) => (field.id === updatedField.id)? updatedField : field))
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }

    return {
        fields,
        isLoading,
        error,
        actions: {
            getAllFields,
            createField,
            updateField
        }
    }
}