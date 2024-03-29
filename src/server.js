import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {connectDB} from './config/db.js';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import {notFound , errorHandler} from './middleware/error.middleware.js';
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import subTaskRouter from './routes/subtask.routes.js';
import webhookRouter from './routes/webhook.routes.js';
import './cron/priority.cron.js';

const app = express();


//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(notFound);

//routes
app.get('/', (req, res) => {
  res.send('Twilio Message Service is running...');
});

app.use('/api/auth',userRouter);
app.use('/api/task',taskRouter);
app.use('/api/subtask',subTaskRouter);
app.use('/api/webhook',webhookRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(chalk.bold.green(`Server started on port ${port}`));
    });
  } catch (error) {
    console.log(chalk.italic.red(error));
  }
};

start();