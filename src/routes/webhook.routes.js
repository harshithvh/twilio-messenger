import {Router} from 'express';
import { authenticateWebhook } from '../middleware/webhookAuth.middleware.js';
import { setupTwilioCall, handleTwilioCall, callStatus } from '../cron/makeCall.cron.js';
import { updateTaskPriority } from '../cron/priority.cron.js';

const webhookRouter = Router();

webhookRouter
.get('/update-task-priority',authenticateWebhook,updateTaskPriority)
.get('/setup-twilio-call',authenticateWebhook,setupTwilioCall)
.post('/handle-twilio-call',handleTwilioCall)
.post('/status-callback', callStatus);

export default webhookRouter;