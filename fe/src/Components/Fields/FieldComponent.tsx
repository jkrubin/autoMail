import React, { RefObject, useEffect, useRef, useState } from "react";
import { Field } from "../../Api/Field/types";
import { useField } from "../../Api/Field";
import { OptionsBar } from "../Utils/OptionsBar";
import './style.css'
import AnimatedHeightDisplay from "../Utils/AnimatedHeightDisplay";

type FieldProps = {
    field:Field
}
const FieldComponent: React.FC<FieldProps> = ({field}) => {
    const {isLoading, actions: fieldActions} = useField()
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
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={() => {
                                setDisplayField(field)
                                setIsEdit(false)
                            }}>Cancel</button>
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