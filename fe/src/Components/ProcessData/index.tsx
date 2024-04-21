import React, { useState } from "react";
import { FormContainer } from "../Utils/FormContainer";
import { InnerContent } from "../Utils/InnerContent";
import { useToast } from "../../Context/toast";
import './style.css'
import { text } from "stream/consumers";

const ProcessData: React.FC = ({}) => {
    const [inputText, setInputText] = useState<string>('')
    const {toast} = useToast()
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        console.log(e.target.files)
        if(!files || !files.length){
            return 
        }
        const file = files[0]
        console.log(file)
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            if(typeof text !== 'string'){
                toast.error('could not read file')
            }else{
                console.log(text)
                setInputText(text || '')
            }
        }
        reader.readAsText(file)
    };


    return(
        <div className="process-data-page">
            <div className="hero">
                <h1>Process Document</h1>
                <p>Give your assistant a document to categorize, extract fields, and dispatch the according action</p>
            </div>
            <FormContainer>
                <h1>Document</h1>
                <InnerContent>
                    <label>
                        Input Text file of document
                        <input type="file" onChange={handleFileChange} />
                    </label>
                    <label>
                        Or just paste the contents here
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </label>
                </InnerContent>
            </FormContainer>
        </div>
    )
}

export default ProcessData