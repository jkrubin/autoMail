import React from "react";
import { Field, emptyField } from "../../Api/Field/types";
import FieldComponent from "./FieldComponent";
import { useField } from "../../Api/Field";
import Tooltip from "../Tooltip";

type FieldListProps = {
    fields: Field[]
    createFieldCB: (field: Field) => Promise<void>
    hasNewField: boolean;
    setNewField: (hasNewField: boolean) => void
}
const FieldList: React.FC<FieldListProps> = ({fields, createFieldCB, hasNewField=false, setNewField}) => {
    const {actions: fieldActions} = useField()

    return(
        <>
            {fields.map((field) => (
                <FieldComponent 
                    key={field.id} 
                    field={field}
                    submitCB={async (field) => await fieldActions.updateField(field)}
                    deleteCB={async () => await fieldActions.deleteField(field.id)}
                />
            ))}
            {hasNewField && 
                <FieldComponent
                    key='new'
                    field={{...emptyField}}
                    submitCB={async (field) => {createFieldCB(field); setNewField(false)}}
                    deleteCB={async ()=> setNewField(false)}
                    isNewField={true}
                    cancelCB={() => setNewField(false)}
                />
            }
            <Tooltip id='doc-tooltip'>
                <p>Extraction Fields are pieces of data that you want to pick out of a Document Type</p>
                <p>For the best results, provide a descriptive name for your Extraction Field and a detailed description of where in your document this field is found</p>
            </Tooltip>
        </>
    )
}

export default FieldList