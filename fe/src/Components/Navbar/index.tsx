import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuItem, Menu } from 'semantic-ui-react'
import { useAuth } from "../../Api/Auth";

const Navbar: React.FC = ({}) => {
    const {user, token} = useAuth()
    const navigate = useNavigate()
    return (
        <nav className="navbar">
            <div className="logo">Auto Mail</div>
            <div className="nav-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/documents" className="nav-item">Documents</Link>
                <Link to="/fields" className="nav-item">Fields</Link>
            </div>
        </nav>
    )
}

export default Navbar