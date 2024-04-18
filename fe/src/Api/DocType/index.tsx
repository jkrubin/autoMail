import { useState } from "react";
import { useApi } from "../utils";
import { DocType } from "./types";

// router.get('/', docTypeController.getDocTypes)
// router.get('/:docTypeId', docTypeController.getDocType)
// router.put('/', docTypeController.createDocType)
// router.post('/:docTypeId', docTypeController.updateDocType)
// router.post('/:docTypeId/link/:fieldId', docTypeController.linkFieldToDoc)

export const useDocType = () => {
    const {fetchAPI} = useApi()
    const [docTypes, setDocTypes] = useState<DocType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const updateDocTypeState = (newDocType: DocType) => {
        setDocTypes((prevState) => {
            return prevState.map(docType => (docType.id === newDocType.id)? newDocType : docType)
        })
    }
    const getDocTypes = async () => {
        setIsLoading(true)
        try{
            const docTypes = await fetchAPI<DocType[]>('docType')
            setDocTypes(docTypes)            
        }catch(err){
        
        }finally{
            setIsLoading(false)
        }
    }
    const createDocType = async (docType: DocType) => {
        try{
            setIsLoading(true)
            const docTypeRes = await fetchAPI<DocType>('docType', {
                method: 'PUT',
                body: JSON.stringify(docType)
            })
        }catch(err){
            
        }finally{
            setIsLoading(false)
        }

    }
    const updateDocType = async (docType: DocType) => {
        try{
            setIsLoading(true)
            const docTypeRes = await fetchAPI<DocType>(`docType/${docType.id}`, {
                method: 'POST',
                body: JSON.stringify(docType)
            })
            updateDocTypeState(docTypeRes)
        }catch(err){

        }finally{
            setIsLoading(false)
        }

    }

    const linkFieldToDoc = async(docTypeId: number, fieldId: number) => {
        setIsLoading(true)
        try{
            const docTypeRes = await fetchAPI<DocType>(`docType/${docTypeId}/link/${fieldId}`)
            updateDocTypeState(docTypeRes)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
        }
    }
    return {
        docTypes, 
        isLoading, 
        error, 
        actions:{
            getDocTypes, 
            updateDocType,
            linkFieldToDoc
        }
    }
}