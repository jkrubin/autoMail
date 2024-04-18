import React from 'react';
import './style.css';

type SubFormProps = {
    children: React.ReactNode;
};

export const SubForm: React.FC<SubFormProps> = ({ children }) => (
    <div className="sub-form">
        {children}
    </div>
);
