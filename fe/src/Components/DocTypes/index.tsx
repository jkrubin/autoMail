import React, { FormEvent, useEffect, useState } from "react"
import { useDocType } from "../../Api/DocType"
import { Icon } from 'semantic-ui-react'
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
        const linkedFields = fields.filter(field => {
            return doc?.fields?.includes(field.id)
        }) || []
        setCurrentFields(linkedFields)
    }, [docTypeId, docTypes])

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

    const handleCreateNew = () => {

    }
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
                    <InnerContent>
                        <h1>Document Type: {currentDocType.name}</h1>
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
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={docTypeEdit.description}
                                        onChange={handleEditChange}
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
                    </InnerContent>
                    <SubForm>
                        <h2>Extraction Fields</h2>
                        {currentFields.map((field) => (
                            <FieldComponent field={field} />
                        ))}
                    </SubForm>
                </FormContainer>
            }
        </div>
    )
}

const DocTypeListItem: React.FC<{docType: DocType}> = ({docType}) => {
    return (
        <div key={docType.id} className="docTypeCard">
            <h3>{docType.name}</h3>
            <p>{docType.description}</p>
            <p>Last updated: {new Date(docType.updatedAt || '').toLocaleDateString()}</p>
            <button>Edit</button>  {/* Placeholder for edit functionality */}
        </div>
    )
}

export default DocTypes