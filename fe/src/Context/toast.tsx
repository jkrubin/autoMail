import React, { createContext, useContext, PropsWithChildren } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ToastContext {
    toast: any
}

const ToastContext = createContext<ToastContext | undefined>(undefined);

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ToastContext.Provider value={{toast}}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('can only toast in the toast context');
    }
    return context;
};
