import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse.js';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

let currentCallStatus;
let currentStatusResolver;
let currentCallSid;

const handleCallStatus = (status, sid) => {
  console.log(`Received call status for CallSid ${sid}: ${status}`);
  currentCallSid = sid;
  currentCallStatus = status;
  if (currentStatusResolver) {
    currentStatusResolver();
  }
};

const waitForCallStatus = () => {
  return new Promise(resolve => {
    currentStatusResolver = resolve;
  });
};

const callStatus = async (req, res) => {
  const { CallStatus, CallSid } = req.body;
  handleCallStatus(CallStatus,CallSid);
  res.sendStatus(200);
};

const setupTwilioCall = async (req, res) => {
  try {
    const currentTime = new Date();
    const tasks = await Task.find({
      status: { $ne: 'DONE' },
      deleted_at: null,
      due_date: {
          $gte: currentTime,
      }
  }, { "userId": 1});

  // remove duplicate userIds
  const userIds = Array.from(new Set(tasks.map(task => task.userId)));

  const userPromises = userIds.map(async userId => {
    const user = await User.findById(userId).select('phone_number priority');
    return { userId, user };
  });

  const userResults = await Promise.all(userPromises);

  const tasksByPriority = {};
  tasks.forEach(task => {
      const userResult = userResults.find(result => result.userId.equals(task.userId));
      if (userResult) {
          const priority = userResult.user.priority ?? 3;
          tasksByPriority[priority] = tasksByPriority[priority] || [];
          tasksByPriority[priority].push(userResult);
      }
  });

  let allCallSids = [];

  for (let priority = 0; priority <= 2; priority++) {
      const tasksToCall = tasksByPriority[priority];
      if (tasksToCall && tasksToCall.length > 0) {
          const phoneNumbers = tasksToCall.map(taskObj => taskObj.user?.phone_number);
          const callSids = await MakePhoneCalls(phoneNumbers );
          allCallSids.push(...callSids);
      }
  }
  res.send(allCallSids);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
};

const handleTwilioCall = async (req, res) => {
  try {
    const vr = new VoiceResponse();
    vr.say({ voice: 'woman' }, 'Hello! This is a friendly reminder from Twilio Messenger.');
    vr.pause({ length: 1 });
    vr.say({ voice: 'woman' }, 'You have one or more tasks due soon.');
    vr.pause({ length: 1 });
    vr.say({ voice: 'woman' }, 'Please review your tasks and take necessary actions.');
    vr.pause({ length: 1 });
    vr.say({ voice: 'woman' }, 'Thank you for using Twilio Messenger. Have a nice day!');

    res.type('text/xml').send(vr.toString());
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Utility Function to make phone calls using Twilio
async function MakePhoneCalls(phoneNumbers) {
  const allCallSids = [];
  let callAnswered = false;
  for (const phoneNumber of phoneNumbers) {
      if (!callAnswered && phoneNumber) {
          const call = twilioClient.calls
              .create({
                  statusCallback: `${process.env.HOST_URL}/api/webhook/status-callback`,
                  statusCallbackEvent: ['completed', 'canceled', 'failed','no-answer'],
                  statusCallbackMethod: 'POST',
                  to: phoneNumber,
                  from: process.env.TWILIO_PHONE_NUMBER,
                  url: `${process.env.HOST_URL}/api/webhook/handle-twilio-call`,
              })

            console.log(`Calling user with phoneNumber ${phoneNumber}...`);

            await waitForCallStatus();

            if (currentCallStatus === 'completed') {
              console.log(`Call to user with phoneNumber ${phoneNumber} was answered.`);
              allCallSids.push({phoneNumber, status: 'answered', callSid: currentCallSid});
              callAnswered = true;
            }
            else{
                console.log(`Call to user with phoneNumber ${phoneNumber} was not answered.`);
                allCallSids.push({phoneNumber, status: 'not-answered', callSid: currentCallSid});
            }
      }
  }
  if (!callAnswered) {
    console.log("No calls were answered");
  }
  return allCallSids;
}

export { setupTwilioCall, handleTwilioCall, callStatus };