import React, { PropsWithChildren, ReactNode, useState } from "react";
import { Modal } from "semantic-ui-react";
import './style.css'
type ModalProps = {
    description: ReactNode;
    successCallback: () => any;
    cancelCallback?: () => any;
}
const ConfirmationModal:React.FC<PropsWithChildren & ModalProps> = ({children, description, successCallback, cancelCallback = ()=>{}}) => {
    const [isOpen, setOpen] = useState(false)

    const handleConfirm = () => {
        successCallback()
        setOpen(false)
    }
    const handleCancel = () => {
        cancelCallback()
        setOpen(false)
    }
    return(
        <Modal
            onClose={()=> setOpen(false)}
            onOpen={() => setOpen(true)}
            open={isOpen}
            trigger={children}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirm Action</h2>
                </div>
                <div className="modal-body">
                    {description}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-warning" onClick={handleConfirm}>Confirm</button>
                    <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmationModal