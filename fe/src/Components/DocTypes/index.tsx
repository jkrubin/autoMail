import React, { useEffect, useState } from "react"
import { useDocType } from "../../Api/DocType"
import { Popup } from 'semantic-ui-react'
import { DocType, emptyDocType } from "../../Api/DocType/types"
import { useNavigate, useParams } from "react-router-dom"
import './style.css'
import { useField } from "../../Api/Field"
import { Field, FieldInput, emptyField } from "../../Api/Field/types"
import { FormContainer } from "../Utils/FormContainer"
import { InnerContent } from "../Utils/InnerContent"
import { OptionsBar } from "../Utils/OptionsBar"
import { SubForm } from "../Utils/SubForm"
import Tooltip from "../Tooltip"
import DocTypeDisplay from "./DocTypeDisplay"
import FieldList from "../Fields/FieldList"
type DocTypesProps = {
    activeTab?: 'document' | 'fields' | 'actions' | null
}
const DocTypes: React.FC<DocTypesProps> = ({activeTab}) => {
    //API Hooks
    const {docTypes, isLoading: isDocTypeLoading, error: docTypeError, actions: docTypeActions} = useDocType()
    const {fields, isLoading: isFieldsLoading, error: fieldsError, actions: fieldActions} = useField()
    //DocTypes State
    const [currentDocType, setCurrentDocType] = useState<DocType | null>(null)
    //Fields State
    const [currentFields, setCurrentFields] = useState<(Field)[]>([])
    const [newField, setNewField] = useState<boolean>(false)

    const navigate = useNavigate()
    const {docTypeId} = useParams()

    useEffect(() => {
        //Get Data on load
        docTypeActions.getDocTypes()
        fieldActions.getAllFields()
    },[])
    useEffect(() => {
        //Set currently selected doc from url, on url change or state change
        const doc = docTypes.find(doc => doc.id === parseInt(docTypeId || '0'))
        setCurrentDocType(doc || null)
        console.log(doc?.fields)
        const linkedFields = fields.filter(field => {
            return doc?.fields?.includes(field.id)
        }) || []
        setCurrentFields(linkedFields)
    }, [docTypeId, docTypes, fields])

    const saveChanges = async(docType: DocType) => {
        docTypeActions.updateDocType(docType)
    }

    const deleteDoc = async(docTypeId: number) => {
        console.log(`delete doc`)
        await docTypeActions.deleteDocType(docTypeId)
        console.log('navy')
        navigate(`/documents/`)
    }
    const handleSelectDocType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(`/documents/${e.target.value}/document`)
    }
    const handleNewField = () => {
        setNewField(true)
    }
    const handleCreateField = async (newField: FieldInput) => {
        if(currentDocType){
            const {name, description} = newField
            const fieldId = await fieldActions.createField({name, description})
            if(fieldId){
                await docTypeActions.linkFieldToDoc(currentDocType.id, fieldId)
                setNewField(false)
            }
        }
    }

    const handleLinkField = (fieldId: number) => {
        if(currentDocType){
            docTypeActions.linkFieldToDoc(currentDocType.id, fieldId)
        }
    }
    const handleCreateNew = async () => {
        const docTypeId = await docTypeActions.createDocType({
            name: '',
            description: ''
        })
        if(docTypeId) {
            navigate(`/documents/${docTypeId}/document`)
        }
    }

    const linkableFields = fields
        .filter(field => !currentDocType?.fields?.includes(field.id))
        .map((field) => (
            <li key={field.id} className="dropdown-item">
                <button onClick={() => handleLinkField(field.id)}>{field.name}</button>
            </li>
        ))
    return(
        <div className="page">
            <div className="hero">
                <h1>My Document Types</h1>
                <p>Review and edit your Document Types</p>
            </div>
            <div className="doc-type-controls">
                <select onChange={handleSelectDocType} defaultValue="">
                    <option value="" disabled>Select your Document Type</option>
                    {docTypes.map((docType) => (
                        <option key={docType.id} value={docType.id}>{docType.name}</option>
                    ))}
                </select>
                <button onClick={handleCreateNew}>Create New</button>
            </div>
            {currentDocType && 
                <FormContainer>
                    <h1 style={{textAlign:'start'}}>Document</h1>
                    <InnerContent>
                        <DocTypeDisplay 
                            displayDocType={currentDocType}
                            onSaveCB={saveChanges}
                            deleteDocCB={deleteDoc}
                        />
                    </InnerContent>
                    <SubForm>
                        <h1>Extraction Fields</h1>
                        <FieldList 
                            fields={currentFields}
                            createFieldCB={handleCreateField}
                            hasNewField={newField}
                            setNewField={setNewField}
                        />
                        <OptionsBar>
                            <button onClick={handleNewField}> Create Field</button>
                            <Popup trigger={<button className="link-field-btn">Link Existing Field</button>} flowing hoverable>
                                <ul className="dropdown-menu">
                                    {linkableFields.length?
                                        linkableFields
                                        :
                                        <div className="emptytext">no fields to link</div>
                                    }
                                </ul>
                            </Popup>

                        </OptionsBar>
                        <Tooltip id='doc-tooltip'>
                            <p>Extraction Fields are pieces of data that you want to pick out of a Document Type</p>
                            <p>For the best results, provide a descriptive name for your Extraction Field and a detailed description of where in your document this field is found</p>
                        </Tooltip>
                    </SubForm>
                </FormContainer>
            }
        </div>
    )
}

export default DocTypes