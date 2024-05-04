import React, { useEffect, useState } from "react";
import { FormContainer } from "../Utils/FormContainer";
import { InnerContent } from "../Utils/InnerContent";
import { useToast } from "../../Context/toast";
import './style.css'
import ConfirmationModal from "../Utils/ConfirmationModal";
import { useExtractions } from "../../Api/Extractions";
import { SubForm } from "../Utils/SubForm";
import { Extraction } from "../../Api/Extractions/types";
import 'react18-json-view/src/style.css'
import JsonView from "react18-json-view";
import { useNavigate, useParams } from "react-router-dom";
import { useDocType } from "../../Api/DocType";
import { Popup } from "semantic-ui-react";
import { useField } from "../../Api/Field";

const ProcessData: React.FC = ({}) => {
    const [inputText, setInputText] = useState<string>('')
    const {extractions, isLoading, actions: extractionActions} = useExtractions()
    const {docTypes, isLoading: isDocTypeLoading, actions: docTypeActions} = useDocType()
    const {fields, isLoading: isFieldsLoading, actions: fieldActions} = useField()
    const [selectedExtraction, setSelectedExtraction] = useState<Extraction | null>(null)
    const {toast} = useToast()
    const {extractionId} = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        extractionActions.getExtractions()
        docTypeActions.getDocTypes()
        fieldActions.getAllFields()
    }, [])

    useEffect(() => {
        setSelectedExtraction(extractions.find((ex) => ex.id === parseInt(extractionId || '0')) || null)
    }, [extractionId, isLoading])
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
    const displayDate = (date: string = '') => {
        const dateObj = new Date(date)
        return `${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2,'0')}/${dateObj.getFullYear()}`
    }
    const processText = async () => {
        if(!inputText){
            toast.error('Please provide some text via typing, pasting, or uploading')
            return
        }
        const extractionId = await extractionActions.processData(inputText)
        navigate(`/process/${extractionId}`)
    }
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
                    <div className="extraction-docs-container">
                        <h2>Types of documents your assistant can extract</h2>
                        <div className="extraction-docs">
                            {docTypes.map(docType => (
                                <Popup trigger={
                                    <div key={docType.id} className="extraction-doc-trigger">
                                        {docType.name}
                                    </div>
                                }>
                                    <div className="extraction-popup-content">
                                        <h3>Extraction Fields</h3>
                                        <ul>
                                            {docType.fields?.map(fieldId => (
                                                <li key={fieldId}>{fields.find(field => field.id === fieldId)?.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Popup>
                            ))}
                        </div>
                    </div>
                    <ConfirmationModal
                        description={
                            <div>
                                <p>Processing this Document will access OpenAI APIs where rates will apply</p>
                                <p>This action will attempt to categorize this document according to the Document Types and Extraction Fields currently associated with your account</p>
                            </div>
                        }
                        successCallback={processText}
                        cancelCallback={() => {}}
                    >
                        <button className="process-button">Process</button>
                    </ConfirmationModal>
                </InnerContent>
                <SubForm>
                    <h2>Extraction</h2>
                    {selectedExtraction &&
                        <div className="extraction-container">
                            <div className="input-text-container">
                                <h2>Input Text</h2>
                                <textarea value={selectedExtraction.text} />
                            </div>
                            <div className="extracted-data-container">
                                <h2>Extracted Data</h2>
                                <JsonView 
                                    src={JSON.parse(selectedExtraction.extractedJSON)}
                                />
                            </div>
                        </div>
                    }
                </SubForm>
                <SubForm>
                    <h2>Previous Extractions</h2>
                    {extractions.map((extraction) => (
                        <div 
                            onClick={() => {navigate(`/process/${extraction.id}`)}}
                            key={extraction.id} 
                            className="extraction-item">
                            <span className="extraction-date">
                                {displayDate(extraction.createdAt)} - 
                            </span>
                            <span className="extraction-text">
                                {extraction.text}
                            </span>
                        </div>
                    ))}
                </SubForm>
            </FormContainer>

        </div>
    )
}

export default ProcessData