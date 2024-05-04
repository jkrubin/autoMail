import React, { RefObject, useEffect, useRef, useState } from "react";
import { Field } from "../../Api/Field/types";
import { useField } from "../../Api/Field";
import { OptionsBar } from "../Utils/OptionsBar";
import './style.css'
import AnimatedHeightDisplay from "../Utils/AnimatedHeightDisplay";
import ConfirmationModal from "../Utils/ConfirmationModal";
import { useToast } from "../../Context/toast";

type FieldProps = {
    field:Field
    isNewField?: boolean
    submitCB: (field: Field) => Promise<any>  
    deleteCB: () => Promise<any>
    cancelCB?: () => any
}
type DisplayFaces = 'SHORT' | 'LONG' | 'EDIT'
const FieldComponent: React.FC<FieldProps> = ({field, submitCB, deleteCB, isNewField = false, cancelCB = () => {}}) => {
    const [displayField, setDisplayField] = useState<Field>(field)
    const [displayFace, setDisplayFace] = useState<DisplayFaces>(isNewField? 'EDIT' : 'SHORT')
    const contentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const longRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const formRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const {toast} = useToast()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDisplayField(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }
    const handleSubmit = async () => {
        const {name, description} = displayField
        if(!name || !description){
            toast.error('Please provide a name and description for your Extraction Field')
            return
        }
        await submitCB(displayField)
        setDisplayFace('LONG')
    }
    const handleDelete = async () => {
        await deleteCB()
    }
    return(
        <div>
            <div className="field-background">
                <AnimatedHeightDisplay 
                    active={displayFace === 'EDIT'? 0
                        :displayFace === 'SHORT'? 1 
                        : 2
                    } 
                    faces={[(
                    <div ref={formRef} className="field-form">
                        <label>
                            name
                            <input 
                                className="field-input"
                                placeholder={`eg: "Client Name", "New Meeting Time"`}
                                name="name"
                                value={displayField.name}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            description
                            <input 
                                className="field-input"
                                placeholder={`eg: "Name of the email sender"`}
                                name="description"
                                value={displayField.description}
                                onChange={handleChange}
                            />
                        </label>
                        <OptionsBar>
                            <ConfirmationModal
                                description='Changing the name or description for this field will affect it for all documents it is linked to'
                                successCallback={handleSubmit}
                                cancelCallback={()=>{}}
                            >
                                <button>Save</button>
                            </ConfirmationModal>
                            <button onClick={() => {
                                cancelCB()
                                setDisplayField(field)
                                setDisplayFace('SHORT')
                            }}>Cancel</button>
                            <ConfirmationModal
                                description='Are you sure you want to delete this permanantly? This will affect other Document Types this field is linked to.'
                                successCallback={handleDelete}
                            >
                                <button>
                                    Delete
                                </button>
                            </ConfirmationModal>
                        </OptionsBar>
                    </div>
                ),
                (
                    <>
                        <div className="field-form field-form-display" ref={contentRef}>
                            <h2 onClick={() => setDisplayFace('LONG')}>{displayField.name || 'unnamed'}</h2>
                            <div className="field-form-submit">
                                <button onClick={() => setDisplayFace('EDIT')}>Edit</button>
                            </div>
                        </div>
                    </>  
                ),(
                    <>
                        <div className="field-form field-form-display" ref={longRef}>
                            <h2 onClick={()=> setDisplayFace('SHORT')}>{displayField.name}</h2>
                            <div className="field-form-submit">
                                <button onClick={() => setDisplayFace('EDIT')}>Edit</button>
                            </div>
                        </div>
                        <div className="field-description">{displayField.description}</div>
                    </>
                )]}/>
            </div>
        </div>
    )
}

export default FieldComponent