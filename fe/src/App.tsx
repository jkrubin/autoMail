import React, { PropsWithChildren, useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom"
import Homepage from './Components/Homepage'
import Login from './Components/Login'
import Navbar from './Components/Navbar'
import { ToastProvider } from './Context/toast'
import { AuthProvider, useAuth } from './Api/Auth'
// import 'semantic-ui-css/semantic.min.css'
import './App.css'
import DocTypes from './Components/DocTypes'

const ProtectedRoute: React.FC<PropsWithChildren> = ({children}) => {
  const {isAuth} = useAuth()
  console.log('isAuth: ', isAuth)
  if(isAuth === "FALSE"){
    return <Navigate to="/login" replace={true} />
  }else if(isAuth === "PENDING"){
    return <div>LOADING AUTH...</div>
  }else{
    return <div>{children}</div>
  }
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div id='app'>
              <Navbar />
              <Routes>
                <Route 
                  path = "/documents"
                  element={<ProtectedRoute><DocTypes /></ProtectedRoute>}
                />
                <Route 
                  path = "/documents/:docTypeId/document"
                  element={<ProtectedRoute><DocTypes activeTab={'document'}/></ProtectedRoute>}
                />
                <Route 
                  path = "/documents/:docTypeId/fields"
                  element={<ProtectedRoute><DocTypes activeTab={'fields'}/></ProtectedRoute>}
                />
                <Route
                  path = "/login"
                  element={<Login isRegister={false}/>}
                />
                <Route 
                  path = "/register"
                  element={<Login isRegister={true}/>}
                />
                <Route 
                  path ="/"
                  element={<ProtectedRoute><Homepage /></ProtectedRoute>}
                />
              </Routes>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
export default App
