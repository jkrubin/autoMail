import React, { FormEvent, useEffect, useState } from "react"
import { useDocType } from "../../Api/DocType"
import { Icon, Popup } from 'semantic-ui-react'
import { DocType } from "../../Api/DocType/types"
import { useNavigate, useParams } from "react-router-dom"
import './style.css'
import { useField } from "../../Api/Field"
import { Field } from "../../Api/Field/types"
import FieldComponent from "../Fields/FieldComponent"
import { BottomBar, EditableDisplay } from "../Utils"
import { FormContainer } from "../Utils/FormContainer"
import { InnerContent } from "../Utils/InnerContent"
import { OptionsBar } from "../Utils/OptionsBar"
import { SubForm } from "../Utils/SubForm"
import AnimatedHeightDisplay from "../Utils/AnimatedHeightDisplay"
import Tooltip from "../Tooltip"
type DocTypesProps = {
    activeTab?: 'document' | 'fields' | 'actions' | null
}
const emptyDocType: DocType = {
    id: -1,
    name: '',
    description: '',
    snakeName: ''
}
const DocTypes: React.FC<DocTypesProps> = ({activeTab}) => {
    //API Hooks
    const {docTypes, isLoading: isDocTypeLoading, error: docTypeError, actions: docTypeActions} = useDocType()
    const {fields, isLoading: isFieldsLoading, error: fieldsError, actions: fieldActions} = useField()
    //DocTypes State
    const [currentDocType, setCurrentDocType] = useState<DocType | null>(null)
    const [isEditDocType, setEditDocType] = useState<boolean>(false)
    const [docTypeEdit, setDocTypeEdit] = useState<DocType>({...emptyDocType})
    //Fields State
    const [currentFields, setCurrentFields] = useState<(Field)[]>([])
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
        setEditDocType(false)
        setCurrentDocType(doc || null)
        setDocTypeEdit(doc || emptyDocType)
        console.log(doc?.fields)
        const linkedFields = fields.filter(field => {
            return doc?.fields?.includes(field.id)
        }) || []
        setCurrentFields(linkedFields)
    }, [docTypeId, docTypes, fields])

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setDocTypeEdit((prevState) => ({...prevState, [e.target.name]: e.target.value}))
    }
    const saveChanges = async() => {
        docTypeActions.updateDocType(docTypeEdit)
    }
    const cancelChanges = () => {
        setEditDocType(false)
    }
    const handleSelectDocType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(`/documents/${e.target.value}/document`)
    }
    const handleCreateField = async () => {
        if(currentDocType){
            const fieldId = await fieldActions.createField({name: 'New Field', description: ''})
            if(fieldId){
                docTypeActions.linkFieldToDoc(currentDocType.id, fieldId)
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
        <div className="doc-types-page">
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
                        <h1>{currentDocType.name}</h1>
                        <AnimatedHeightDisplay 
                            active={isEditDocType? 0 : 1}
                            faces={[(
                                <form>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={docTypeEdit.name}
                                        onChange={handleEditChange}
                                        placeholder="give a descriptive name for your document type"
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={docTypeEdit.description}
                                        onChange={handleEditChange}
                                        placeholder="give a description of what you might find in this type of document. Feel free to give examples, although not neccesary!"
                                    />
                                </label>
                                <OptionsBar>
                                    <button type="button" onClick={saveChanges}>Save</button>
                                    <button type="button" onClick={cancelChanges}>Cancel</button>
                                </OptionsBar>
                            </form> 
                            ),(
                            <div>
                                <div className="doc-type-description">
                                    {currentDocType.description}
                                </div>
                                <OptionsBar>
                                    <button onClick={() => setEditDocType(true)}>Edit</button>
                                </OptionsBar>
                            </div> 
                            )]}
                        />
                        <Tooltip id='doc-tooltip'>
                            <p>Each Document Type represents a type of email or other document your assistant will try to categorize.</p>
                            <p>For the best results give your assistant a descriptive name and a more detailed description about what you might find in this type of document</p>
                        </Tooltip>
                    </InnerContent>
                    <SubForm>
                        <h1>Extraction Fields</h1>
                        {currentFields.map((field) => (
                            <FieldComponent key={field.id} field={field} fieldActions={fieldActions} />
                        ))}
                        <OptionsBar>
                            <button onClick={handleCreateField}> Create Field</button>
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