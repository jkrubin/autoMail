import React, { useEffect, useState } from "react";
import AnimatedHeightDisplay from "../Utils/AnimatedHeightDisplay";
import { DocType } from "../../Api/DocType/types";
import { OptionsBar } from "../Utils/OptionsBar";
import Tooltip from "../Tooltip";
import { useDocType } from "../../Api/DocType";
import { useToast } from "../../Context/toast";
import ConfirmationModal from "../Utils/ConfirmationModal";

type DocTypeProps = {
    displayDocType: DocType;
    onSaveCB: (editDocType: DocType) => Promise<void>
    deleteDocCB: (docTypeId: number) => Promise<void>
    editProp?: boolean;
}
const DocTypeDisplay: React.FC<DocTypeProps> = ({displayDocType, onSaveCB, deleteDocCB, editProp = false}) => {
    const {actions} = useDocType();
    const [docTypeEdit, setDocTypeEdit] = useState<DocType>({...displayDocType})
    const [isEdit, setIsEdit] = useState<boolean>(editProp)
    const {toast} = useToast()
    useEffect(() => {
        setIsEdit(editProp)
    }, [editProp])

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setDocTypeEdit((prevState) => ({...prevState, [e.target.name]: e.target.value}))
    }
    const cancelChanges = () => {
        setDocTypeEdit(displayDocType)
        setIsEdit(false)
    }

    const handleSave = () => {
        const {name, description} = docTypeEdit
        if(!name || !description) {
            toast.error('Please provide a name and description for your docuemnt type')
            return
        }
        onSaveCB(docTypeEdit)
        setIsEdit(false)
    }
    return (
            <>
                <h1>{displayDocType.name}</h1>
                <AnimatedHeightDisplay 
                    active={isEdit? 0 : 1}
                    faces={[(
                        <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={docTypeEdit.name}
                                onChange={handleEditChange}
                                placeholder={`eg: "Update Reservation", "Schedule Meeting", "Cancel Membership"`}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={docTypeEdit.description}
                                onChange={handleEditChange}
                                placeholder={`Describe this type of email to your Assistant:
    
    ex: "Members will email us wanting to modify their reservation. Common requests include: table change, new party size, new time or date."
    ex: "People will email me asking if I am free for a meeting at a certain date/time"
    ex: "People will email giving us a reason they want to cancel their annual membership"
                                `}
                            />
                        </label>
                        <OptionsBar>
                            <button type="button" onClick={handleSave}>Save</button>
                            <button type="button" onClick={cancelChanges}>Cancel</button>
                            <ConfirmationModal
                                description='Are you sure you want to delete this Document Type'
                                successCallback={() => deleteDocCB(docTypeEdit.id)}
                                cancelCallback={()=>{}}
                            >
                                <button>Delete</button>
                            </ConfirmationModal>
                        </OptionsBar>
                    </div> 
                    ),(
                    <div>
                        <div className="doc-type-description">
                            {displayDocType.description}
                        </div>
                        <OptionsBar>
                            <button onClick={() => setIsEdit(true)}>Edit</button>
                        </OptionsBar>
                    </div> 
                    )]}
                />
                <Tooltip id='doc-tooltip'>
                    <p>Each Document Type represents a type of email or other document your assistant will try to categorize.</p>
                    <p>For the best results give your assistant a descriptive name and a more detailed description about what you might find in this type of document</p>
                </Tooltip>
            </>
    )
}

export default DocTypeDisplay