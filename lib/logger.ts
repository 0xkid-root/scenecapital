/**
 * Logger utility for SceneCapital
 * Simple logger implementation for development purposes
 */

interface LoggerOptions {
  level: 'debug' | 'info' | 'warn' | 'error';
  timestamp?: boolean;
}

class Logger {
  private level: string;
  private showTimestamp: boolean;
  
  constructor(options: LoggerOptions = { level: 'info', timestamp: true }) {
    this.level = options.level;
    this.showTimestamp = options.timestamp !== false;
  }
  
  private getTimestamp(): string {
    if (!this.showTimestamp) return '';
    return `[${new Date().toISOString()}]`;
  }
  
  private log(level: string, message: string, meta?: any): void {
    const timestamp = this.getTimestamp();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`${timestamp} [${level.toUpperCase()}] ${message}${metaString}`);
  }
  
  debug(message: string, meta?: any): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, meta);
    }
  }
  
  info(message: string, meta?: any): void {
    if (this.shouldLog('info')) {
      this.log('info', message, meta);
    }
  }
  
  warn(message: string, meta?: any): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, meta);
    }
  }
  
  error(message: string, meta?: any): void {
    if (this.shouldLog('error')) {
      this.log('error', message, meta);
    }
  }
  
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configuredLevelIndex = levels.indexOf(this.level);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= configuredLevelIndex;
  }
}

// Export a singleton instance
const logger = new Logger({
  level: process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' || 'info',
  timestamp: true
});

export default logger;
