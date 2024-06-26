import React, { PropsWithChildren, ReactNode, createContext, useContext, useState } from "react"
import { useApi } from "../utils"
import { Field, FieldInput } from "./types"
import { useToast } from "../../Context/toast";

// router.get(('/'), fieldController.getAllFields)
// router.put('/', fieldController.createNewField)
// router.post('/', fieldController.updateField)
export type FieldContextType = {
    fields: Field[], 
    isLoading: boolean, 
    error: string | ReactNode, 
    actions:{
        getAllFields: () => Promise<void>,
        createField: (field: FieldInput) => Promise<number | undefined>,
        updateField: (field: Field) => Promise<void>,
        deleteField: (id: number) => Promise<void>,
    }
};


export const FieldContext = createContext<FieldContextType | undefined>(undefined);


export const FieldProvider: React.FC<PropsWithChildren> = ({children}) => {
    const {fetchAPI} = useApi()
    const {toast} = useToast()
    const [fields, setFields] = useState<Field[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const getAllFields = async() => {
        try{
            setIsLoading(true)
            const fieldsRes = await fetchAPI<Field[]>('field')
            console.log('fields set')
            setFields(fieldsRes)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
        }
    }

    const createField = async(field: {name: string, description: string}) => {
        setIsLoading(true)
        try{
            const {name, description} = field
            const newField = await fetchAPI<Field>('field', {
                method: 'PUT',
                body: JSON.stringify({name, description})
            })
            setFields((prevState) => [...prevState, newField])
            return newField.id
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
            toast('Field Update Saved')
        }catch(err){

        }finally{
            setIsLoading(false)
        }
    }

    const deleteField = async(fieldId: number) => {
        try{
            setIsLoading(true)
            await fetchAPI<any>(`field/${fieldId}`, {
                method: 'DELETE',
            })
            setFields(prevState => prevState.filter(field => field.id !== fieldId))
        }catch(err){

        }
    }
    return (
        <FieldContext.Provider value = {
            {
                fields,
                isLoading,
                error,
                actions: {
                    getAllFields,
                    createField,
                    updateField,
                    deleteField
                }
            } 
        }>
            {children}
        </FieldContext.Provider>
    )
}

export const useField = () => {
    const context = useContext(FieldContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an FieldProvider');
    }
    return context;
};
