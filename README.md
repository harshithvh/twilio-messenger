# twilio-messenger

# Application Structure

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
