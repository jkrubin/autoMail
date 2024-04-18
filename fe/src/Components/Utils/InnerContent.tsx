import React from 'react';
import './style.css';

type InnerContentProps = {
    children: React.ReactNode;
};

export const InnerContent: React.FC<InnerContentProps> = ({ children }) => (
    <div className="inner-content">
        {children}
    </div>
);