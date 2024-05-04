import { PropsWithChildren, ReactNode, createContext, useContext, useState } from "react";
import { useApi } from "../utils";
import { DocType, DocTypeInput } from "./types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Context/toast";

// router.get('/', docTypeController.getDocTypes)
// router.get('/:docTypeId', docTypeController.getDocType)
// router.put('/', docTypeController.createDocType)
// router.post('/:docTypeId', docTypeController.updateDocType)
// router.post('/:docTypeId/link/:fieldId', docTypeController.linkFieldToDoc)

export type DocTypeContextType = {
    docTypes: DocType[], 
    isLoading: boolean, 
    error: string | ReactNode, 
    actions:{
        createDocType: (doc: DocTypeInput) => Promise<number | undefined>,
        getDocTypes: () => Promise<void>, 
        updateDocType: (doc: DocType) => Promise<number | undefined>,
        linkFieldToDoc: (docTypeId: number, fieldId: number) => Promise<void>,
        deleteDocType: (docTypeId: number) => Promise<void>
    }
};


export const DocTypeContext = createContext<DocTypeContextType | undefined>(undefined);


export const DocTypeProvider: React.FC<PropsWithChildren> = ({children}) => {
    const {fetchAPI} = useApi()
    const navigate = useNavigate()
    const {toast} = useToast()
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
    const createDocType = async (docType: {name: string, description: string}) => {
        try{
            setIsLoading(true)
            const docTypeRes = await fetchAPI<DocType>('docType', {
                method: 'PUT',
                body: JSON.stringify(docType)
            })
            setDocTypes([...docTypes, docTypeRes])
            setIsLoading(false)
            toast('New Document Type Created!')
            return docTypeRes.id
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
            toast("Document Updated")
            return docTypeRes.id
        }catch(err){

        }finally{
            setIsLoading(false)
        }

    }

    const linkFieldToDoc = async(docTypeId: number, fieldId: number) => {
        setIsLoading(true)
        try{
            const docTypeRes = await fetchAPI<DocType>(`docType/${docTypeId}/link/${fieldId}`, {
                method: 'POST'
            })
            updateDocTypeState(docTypeRes)
            toast(`Field Linked to Doc`)
            setIsLoading(false)
        }catch(err){
            setIsLoading(false)
        }
    }
    const deleteDocType = async(docTypeId: number) => {
        setIsLoading(true)
        try{
            const docTypeRes = await fetchAPI<any>(`docType/${docTypeId}`, {
                method: 'DELETE'
            })
            setDocTypes((prevState) => prevState.filter(doc => doc.id !== docTypeId))
            toast('Document Deleted')
        }catch(e){
            setIsLoading(false)
        }
        setIsLoading(false)
        return
    }
    return (
        <DocTypeContext.Provider value={
            {
                docTypes, 
                isLoading, 
                error, 
                actions:{
                    createDocType,
                    getDocTypes, 
                    updateDocType,
                    linkFieldToDoc,
                    deleteDocType
                }
            }
        }>
            {children}
        </DocTypeContext.Provider>
    )
}

export const useDocType = () => {
    const context = useContext(DocTypeContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an DocTypeProvider');
    }
    return context;
};
