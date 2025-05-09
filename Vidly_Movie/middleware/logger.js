// logger.js
const winston = require('winston');
require('winston-mongodb');
require('dotenv').config();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI || 'mongodb://localhost:27017/logs',
      collection: 'log_errors',
      level: 'error',
    })
  ]
});

// Handle uncaught exceptions
process.on('uncaughtException', (ex) => {
  logger.error(`Uncaught Exception: ${ex.message}`, ex);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (ex) => {
  logger.error(`Unhandled Rejection: ${ex.message}`, ex);
  process.exit(1);
});

module.exports = logger;
