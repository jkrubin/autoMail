import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Api/Auth";
import './style.css'
const Navbar: React.FC = ({}) => {
    const {isAuth, logout} = useAuth()
    const navigate = useNavigate()
    return (
        <nav className="navbar">
            <div className="logo">Auto Mail</div>
                {isAuth === "TRUE"?
                    <div className="nav-links">
                        <Link to="/" className="nav-item">Home</Link>
                        <Link to="/documents" className="nav-item">Documents</Link>
                        <Link to="/fields" className="nav-item">Fields</Link>
                        <Link to="/process" className="nav-item">Process</Link>
                        <div onClick={() => logout()} className="nav-item">Logout</div>
                    </div>
                    :
                    <div className="nav-links">
                        <Link to="/" className="nav-item">Home</Link>
                        <Link to="/login" className="nav-item">Login</Link>
                    </div>
                }
        </nav>
    )
}

export default Navbar