# twilio-messenger

Create a Task Management API with robust features including:

  - **Automated Priority Management**: Utilizes cron jobs to dynamically adjust task priorities based on their due dates according to a defined policy.
  - **Twilio Integration**: Integrates with Twilio for voice call reminders based on user priority. Calls are made in ascending order of user priority (0 first, then 1, 2) when tasks become overdue, with safeguards        to avoid calling subsequent users if a previous call is unanswered.

## Basic Requirements

✅ **API Security**: Implements JWT authentication to ensure secure access to APIs.

✅ **Input Validation**: Validates user input for all API endpoints to prevent invalid data entry.

✅ **Error Handling**: Provides user-friendly error messages for all potential issues encountered during API calls.

## Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=for-the-badge&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Ngrok](https://img.shields.io/badge/ngrok-140648?style=for-the-badge&logo=Ngrok&logoColor=white)
![twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio&logoColor=white)

## Reference

* [Cron Job](https://cron-job.org/en/)
* [Twilio](https://www.twilio.com/docs/voice)

## Running the Backend

- Clone the repo:
  
  ```bash
  git clone https://github.com/harshithvh/twilio-messenger.git
  
- Open directory in terminal:

  ```bash
  cd twilio-messenger

- Create a .env file:

  ```bash
  MONGO_URI=mongodb://localhost:27017/{app}
  JWT_SECRET=JWT_SECRET_KEY
  WEBHOOK_API_KEY=WEBHOOK_API_KEY
  HOST_URL=NGROK_URL
  TWILIO_ACCOUNT_SID=YOUR_ACCOUNT_SID
  TWILIO_AUTH_TOKEN=YOUR_AUTH_TOKEN
  TWILIO_PHONE_NUMBER=YOUR_PHONE_NUMBER
  NODE_ENV=development

- Install project dependencies:

  ```bash
  npm install

- Fire up the server:

  ```bash
   nodemon server.js

- Access api at:

  ```bash
  http://localhost:5000/

## Application Structure

<details>
  <summary>Click to expand!</summary>
    
- 📂`src`
    - 📂`config`
        - 📝`db.js`
    - 📂`controller`
        - 📝`subtask.controller.js`
        - 📝`task.controller.js`
        - 📝`user.controller.js`
    - 📂`cron`
        - 📝`makeCall.cron.js`
        - 📝`priority.cron.js`
     - 📂`middleware`
        - 📝`auth.middleware.js`
        - 📝`error.middleware.js`
        - 📝`webhookAuth.middleware.js`
     - 📂`models`
        - 📝`subtask.model.js`
        - 📝`task.model.js`
        - 📝`user.model.js`
     - 📂`routes`
        - 📝`subtask.routes.js`
        - 📝`task.routes.js`
        - 📝`user.routes.js`
        - 📝`webhook.routes.js`
     - 📂`utils`
        - 📝`generateJWT.util.js`
        - 📝`getPriority.util.js`
        - 📝`updateTask.util.js`
    - 📝`server.js(Entrypoint)`
