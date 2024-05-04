# autoMail
AutoMail is your AI powered assistant built to read your email and delegate actions automatically. Train your assistant to know what kind of mail you recieve and what key data points to extract out. 

![autoMail](https://github.com/jkrubin/autoMail/assets/6620604/ee75a4e5-bb93-4a2f-b44b-8d46b6f2b95f)
AutoMail v1: 
Email goes in. Data comes out

## Features 
 - Define Types of emails you will want to automatically parse called Document Types
 - Define Data points that you want extracted from your email called Extraction Fields
 - Process your Mail by uploading or pasting in mail or other documents you want to parse
## Upcoming Features 
 - Design actions: such as webhooks, or calendar integrations for your assistant to dispatch based on your mail
 - Allow AutoMail access to your inbox to start processing mail automatically

## Run locally
  1. Set Environemnt Variable
    - `OPENAI_API_KEY` - {your OpenAi API key}

  2. Start the application
  ```
    docker-compose up --build
  ```
    
  3. Navigate your browser to [http://localhost:8080](http://localhost:8080)
