import React, { useEffect, useState } from "react";
import './style.css'
import { Link, Navigate } from "react-router-dom";
import { FormInput } from "semantic-ui-react";
import { ToastContainer, toast} from 'react-toastify'
import { useToast } from "../../Context/toast";
import { useAuth } from "../../Api/Auth";
const Login: React.FC<{isRegister: boolean}> = ({isRegister}) => {
    const {login, register, isAuth} = useAuth()

    if(isAuth==='TRUE'){
        return <Navigate to='/' replace={true} />
    }
    const {toast} = useToast()
    const [formData, setFormData] = useState<{
        email: string, 
        password: string, 
        password_confirm: string}
        >({
            email: "", 
            password: "", 
            password_confirm: ""
        })
    const [isPasswordMatching, setIsPasswordMatching] = useState<boolean>(true)
    useEffect(() => {
        if(isRegister){
            setIsPasswordMatching(formData.password === formData.password_confirm)
        }
    }, [formData])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((formData) => {
            return {...formData, [e.target.name]: e.target.value}
        })
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {email, password} = formData
        try{
            login({email,password})
        }catch(err){

        }
    }

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div>
            <div className="login-container">
                <>
                <h2 className="login-title">{isRegister? "Register" : "Login"}</h2>
                <form className="login-form" onSubmit={isRegister? handleRegister : handleLogin}>
                    <div className="login-form-field">
                    <input
                        type="input"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    </div>
                    <div className="login-form-field">
                        <FormInput
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="Password"
                            onChange={handleChange}
                        />
                    </div>
                    {isRegister &&
                        <div className="login-form-field">
                            <FormInput
                                type="password"
                                name="password_confirm"
                                value={formData.password_confirm}
                                placeholder="Confirm"
                                onChange={handleChange}
                                error={!formData.password_confirm || isPasswordMatching? null : {
                                    content: <span className="error-text">Password is not matching</span>,
                                    pointing: "above"
                                }}
                            />
                        </div>
                    }
                    <button type="submit" className="login-button">{isRegister? "Register" : "Login"}</button>
                    {isRegister?
                        <div className="login-options"> 
                            <div style={{flex: 1, textAlign: "center"}}>
                                <Link to="/login">Have an account? Login</Link>
                            </div>
                        </div>
                        :
                        <div className="login-options">
                            <div>
                                Forgot password?
                            </div>
                            <div>
                                <Link to="/register">Register</Link>
                            </div>
                        </div>
                    }
                </form>
                </>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login