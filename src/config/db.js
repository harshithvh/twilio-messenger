import chalk from 'chalk';
import mongoose from 'mongoose';

export const connectDB = async (uri) => {
    try {
      await mongoose.connect(uri);
      console.log(chalk.bold.magenta('Connected to MongoDB'));
    } catch (error) {
      console.error(chalk.italic.red('Error connecting to MongoDB:', error));
      process.exit(1);
    }
  };