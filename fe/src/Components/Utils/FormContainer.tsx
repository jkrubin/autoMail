import React from 'react';
import './style.css'

type FormContainerProps = {
    children: React.ReactNode;
};

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => (
    <div className="form-container">
        {children}
    </div>
);