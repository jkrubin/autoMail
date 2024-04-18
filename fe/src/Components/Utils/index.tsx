import React, { PropsWithChildren } from "react";
import './style.css'

const EditableDisplay:React.FC<PropsWithChildren> = ({children}) =>{
    return(
        <div className="editable-display">
            {children}
        </div>
    )
}
const DisplayBody:React.FC<PropsWithChildren> = ({children}) =>{
    return(
        <div className="display-body">
            {children}
        </div>
    )
}
const BottomBar:React.FC<PropsWithChildren> = ({children}) => {
    return(
        <div className='edit-bottom-bar'>
            {children}
        </div>
    )
}

export {EditableDisplay, BottomBar, DisplayBody}