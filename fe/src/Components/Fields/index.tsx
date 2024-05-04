import React, { useEffect } from "react";
import { useField } from "../../Api/Field";
import FieldComponent from "./FieldComponent";
import { Field } from "../../Api/Field/types";

const Fields: React.FC = ({}) => {
    const {fields, isLoading: isFieldsLoading, actions: fieldActions} = useField()
    useEffect(()=> {
        fieldActions.getAllFields()
    }, [])
    const handleSubmit = async(field: Field) => {
        fieldActions.updateField(field)
    }
    return (
        <div className="page">
            <div className="hero">
                <h1>My Extraction Fields</h1>
                <p>Review and edit your Extraction Fields</p>
            </div>
            {fields.map((field) => <FieldComponent 
                key={field.id}
                field={field}
                submitCB={handleSubmit}
                deleteCB={async () => {fieldActions.deleteField(field.id)}}
            />)}
        </div>
    )
}

export default Fields