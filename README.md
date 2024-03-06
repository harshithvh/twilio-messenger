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
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=for-the-badge&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A)

## Reference

* [Cron Job](https://cron-job.org/en/)
* [Twilio](https://www.twilio.com/docs/voice)

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
