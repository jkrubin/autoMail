import React, { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDocType } from "../../Api/DocType";
import { useField } from "../../Api/Field";
import { Extraction } from "../../Api/Extractions/types";
import { DocType, emptyDocType } from "../../Api/DocType/types";
import { Field, FieldInput } from "../../Api/Field/types";
import FieldList from "../Fields/FieldList";
import DocTypeDisplay from "../DocTypes/DocTypeDisplay";
import { InnerContent } from "../Utils/InnerContent";
import { OptionsBar } from "../Utils/OptionsBar";
import './style.css'
import 'semantic-ui-css/semantic.min.css'

type FeatureParam = {
    title: string | ReactNode,
    description: string | ReactNode,
    link?: string,
    icon?: string | ReactNode | null
}

const Homepage: React.FC = ({}) => {
    const {docTypes, isLoading: isDocTypeLoading, actions: docTypeActions} = useDocType()
    const [demoDocId, setDemoDocId] = useState<number | null>(null)
    const [demoDoc, setDemoDoc] = useState<DocType | null>(null)

    const {fields, isLoading: isFieldsLoading, actions: fieldActions} = useField()
    const [isNewField, setIsNewField] = useState(false)
    const [demoFields, setDemoFields] = useState<Field[]>([])
    const [tutorialStep, setStep] = useState<'DOC' | 'FIELD' | 'PROCESS'>('DOC')

    useEffect(() => {
        if(!isDocTypeLoading && docTypes.length){
            const firstDoc = docTypes[0]
            if(firstDoc.id !== demoDocId){
                setDemoDocId(firstDoc.id)
                setDemoDoc(firstDoc)
                setStep('FIELD')
            }else {
                setDemoDoc(firstDoc)
            }
            return
        } 
        if(!isDocTypeLoading && demoDocId){
            setDemoDoc(docTypes.find(docType => docType.id === demoDocId) || null)
        }
    }, [isDocTypeLoading, demoDocId])

    useEffect(() => {
        const linkedFields = fields.filter(field => demoDoc?.fields?.includes(field.id));
        setDemoFields(linkedFields)
        if(linkedFields.length){
            setStep('PROCESS')
        }
    }, [demoDoc, isDocTypeLoading, fields, isFieldsLoading])
    useEffect(() => {
        docTypeActions.getDocTypes()
        fieldActions.getAllFields()
    },[])
    const demoExtraction: Extraction = {
        id: 0,
        text: 'Hello, I am running late for my reservation. There was a big wine spillage on the highway and we had to help drink all of the wine that was spilling out of the wine truck. We will be there at 10:30am instead. Also, Marissa has taken ill from all of the road wine so I am afraid we will be down to 4 for our table. Thank you - Jane Doe',
        extractedJSON: `{"document":"Update Reservation","data":{"new_reservation_time":"10:30am","new_reservation_size":"4","client_name":"Jane Doe"}}`
    }
    const createDemoField = async (newField: FieldInput) => {
        if(demoDoc){
            const {name, description} = newField
            const fieldId = await fieldActions.createField({name, description})
            if(fieldId){
                await docTypeActions.linkFieldToDoc(demoDoc.id, fieldId)
                setIsNewField(false)
                setStep('PROCESS')
            }
        }
    }

    const features: Record<string,FeatureParam> = {
        docs: {
            title: "Train Your Assistant (1/2) - Documents",
            description: (
                <div>
                    <p>Train Your assistant to understand what kind of mail you're expecting by giving it descriptions of the <b>types of mail</b> you get. When your assistant reads your mail, they will try to match incoming mail to your descriptions</p>
                    <p>All of your documents are available to create/edit in the <Link className="inline-link" to ='/documents'>Documents</Link> tab</p>
                    <p>Each <b>type of mail</b> is called a <b>"Document Type"</b>. Start by creating a Document Type below outlining a certain type of mail you recieve</p>
                    <InnerContent>
                        <DocTypeDisplay 
                            displayDocType={demoDoc? {...demoDoc} : {...emptyDocType}}
                            editProp={!demoDocId}
                            onSaveCB={async (doc) => {
                                const {name, description} = doc
                                const docTypeId = await docTypeActions.createDocType({name, description})
                                setDemoDocId(docTypeId || null)
                                setStep('FIELD')
                                setIsNewField(true)
                            }}
                            deleteDocCB={(docTypeId) => docTypeActions.deleteDocType(docTypeId)}
                        />
                    </InnerContent>
                </div>
            )
        },
        fields: {
            title: "Train Your Assistant (2/2) - Fields",
            description: (
                <div>
                    <p>Train your assistant to <b>Extract Data Fields</b> out of your documents by defining Extraction Fields.</p>
                    <p>Each Extraction <b>"Field"</b> on a <b>Document Type</b> describes a piece of information that you want to capture from that type of document</p>
                    <p>You can create, edit, and manage your fields when looking at any <Link className="inline-link" to ='/documents'>Document</Link>. Also all of your Fields are available to edit in the <Link className="inline-link" to='/fields'>Fields</Link> tab</p>
                    <p>Describe some data to create some Extraction Fields For your Assistant... </p>
                    <InnerContent>
                        <FieldList
                            fields={demoFields}
                            createFieldCB={createDemoField}
                            hasNewField={isNewField}
                            setNewField={setIsNewField}
                        />
                        <OptionsBar>
                            <button disabled={isNewField} onClick={()=>setIsNewField(true)}>Add Field</button>
                        </OptionsBar>
                    </InnerContent>
                </div>
            )
        },
        actions: {
            title: "Trigger Actions (Coming Soon)",
            description: (
                <p>
                    Set up webhooks to let AutoMail perform actions based on the <b>Document Type</b> it recieves
                </p> 
            )
        },
        process: {
            title: "Process Mail",
            description: 
            (<div>
                <p>Once you have all your document types set up, you can <Link to='/process'>Process</Link> your mail to convert it to data</p>
                <p>Coming soon: Allow your assistant access to your inbox to automatically process mail</p>
            </div>),
            link: '/process'
        },
    }

    return (
        <div className="homepage">
            <div className="hero">
                <h1>Welcome to Auto Mail</h1>
                <div className="hero-description">
                    <p>Auto Mail is your assistant for categorizing and picking key data out of email or other documents. Follow the steps below to tell your assistant what kind of documents you want it to sort, and then start processing!</p>
                    <p>TL;DR: Emails go in... Data comes out...</p>
                </div>

            </div>
            <div className="features">
                <h1>How it works...</h1>
                <div className="features-inner">
                    <HomepageFeature {...features.docs} />
                    {(tutorialStep === 'FIELD' || tutorialStep === 'PROCESS') &&
                        <HomepageFeature {...features.fields}/>
                    }
                    {tutorialStep === 'PROCESS' && 
                        <>
                            <HomepageFeature {...features.process} />
                            <HomepageFeature {...features.actions} />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

const HomepageFeature: React.FC<FeatureParam> = ({title, description, icon = null}) => {
    return (
        <div className="feature">
            <div className="feature-icon"></div>
            <div className="feature-content">
                <h2 className='feature-title'>{title}</h2>
                <div className="feature-description">
                    {description}
                </div>
            </div>
        </div>
    )
}
export default Homepage