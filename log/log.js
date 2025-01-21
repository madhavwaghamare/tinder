const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',  // Default log level
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Format timestamp
        winston.format.colorize(),                                   // Add colors to log levels
        winston.format.printf(({ timestamp, level, message, service, requestId, error, userId = "" }) => {
            let logMessage = `${timestamp} [${level}]`;

            if (userId) {
                logMessage += ` [User Id: ${userId}]`;
            }

            logMessage += ` ${message}`;

            if (error) {
                logMessage += ` | Error: ${error.message} | Stack: ${error.stack}`;
            }

            return logMessage;
        })
    ),
    transports: [
        new winston.transports.Console(),   // Console transport with colorized output
        new winston.transports.File({ filename: 'application.log' })  // File transport
    ],
});

module.exports = logger;