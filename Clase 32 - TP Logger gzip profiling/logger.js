const log4js = require('log4js');


log4js.configure({
  appenders: {
    consola: { type: 'console' },
    archivoErrores: { type: 'file', filename: 'logs/error.log' },
    archivowarn: { type: 'file', filename: 'logs/warn.log' },
    
    
    loggerConsola: {
      type: 'logLevelFilter',
      appender: 'consola',
      level: 'all',
    },
    loggerArchivoErrores: {
      type: 'logLevelFilter',
      appender: 'archivoErrores',
      level: 'error',
    },
    loggerArchivoWarn: {
      type: 'logLevelFilter',
      appender: 'archivowarn',
      level: 'warn',
      maxLevel: 'warn'
    }
  },
  categories: {
    default: {
      appenders: ['loggerConsola','loggerArchivoErrores','loggerArchivoWarn'],
      level: 'all',
    }
  }
})

const logger = log4js.getLogger()

//export logger
module.exports = logger;
