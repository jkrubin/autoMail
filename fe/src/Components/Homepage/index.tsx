import React, { ReactNode } from "react";
import './style.css'
import 'semantic-ui-css/semantic.min.css'

type FeatureParam = {
    title: string | ReactNode,
    description: string | ReactNode,
    icon?: string | ReactNode | null
}

const Homepage: React.FC = ({}) => {

    const features: FeatureParam[] = [
        {
            title: "Categorize Documents",
            description: "Create Document Categories that describe the type of mail you want to automate"
        },
        {
            title: "Extract Fields",
            description: "Define Data that you want to extract from your email. Link it to your Docuemnt Categories"
        },
        {
            title: "Process Mail",
            description: "Link your email to your AutoMail to start processing your mail"
        },
        {
            title: "Trigger Actions",
            description: "Let AutoMail perform actions resulting from your email so you don't have to!"
        }
    ]
    return (
        <div className="homepage">
            <div className="hero">
                <h1>Welcome to Auto Mail</h1>
                <p>Automate your email extraction and organization with ease.</p>
            </div>
            <div className="features">
                <div className="features-inner">
                    {features.map(feature => <HomepageFeature {...feature}/>)}
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