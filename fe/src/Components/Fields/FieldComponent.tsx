import React, { RefObject, useEffect, useRef, useState } from "react";
import { Field } from "../../Api/Field/types";
import { useField } from "../../Api/Field";
import { OptionsBar } from "../Utils/OptionsBar";
import './style.css'
import AnimatedHeightDisplay from "../Utils/AnimatedHeightDisplay";
import ConfirmationModal from "../Utils/ConfirmationModal";

type FieldProps = {
    field:Field
    fieldActions:any
}
const FieldComponent: React.FC<FieldProps> = ({field, fieldActions}) => {
    const [displayField, setDisplayField] = useState<Field>(field)
    const [isEdit, setIsEdit] = useState(false)
    const contentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const formRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number>(0)

    useEffect(() => {
        console.log(formRef.current?.scrollHeight, contentRef.current?.scrollHeight)
        setContentHeight(isEdit? formRef.current?.scrollHeight || 0 : contentRef.current?.scrollHeight || 0)
    }, [isEdit, contentRef, formRef])
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDisplayField(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }
    const handleSubmit = () => {
        fieldActions.updateField(displayField)
        setIsEdit(false)
    }
    const handleDelete = () => {
        fieldActions.deleteField(displayField.id)
    }
    return(
        <div>
            <div className="field-background">
                <AnimatedHeightDisplay 
                    active={isEdit? 0 : 1} 
                    faces={[(
                    <div ref={formRef} className="field-form">
                        <label>
                            name
                            <input 
                                className="field-input"
                                name="name"
                                value={displayField.name}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            description
                            <input 
                                className="field-input"
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
                                setDisplayField(field)
                                setIsEdit(false)
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
                            <h2>{displayField.name}</h2>
                            <div className="field-form-submit">
                                <button onClick={() => setIsEdit(true)}>Edit</button>
                            </div>
                        </div>
                    </>  
                )]}/>
            </div>
        </div>
    )
}

export default FieldComponent