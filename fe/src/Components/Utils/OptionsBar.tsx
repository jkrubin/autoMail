import React from 'react';
import './style.css';

type OptionsBarProps = {
    children: React.ReactNode;
};

export const OptionsBar: React.FC<OptionsBarProps> = ({ children }) => (
    <div className="options-bar">
        {children}
    </div>
);
