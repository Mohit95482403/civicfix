type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Filter out potentially sensitive fields before printing
function sanitizeMetadata(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key', 'credential', 'apikey'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const logger = {
  log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const sanitized = sanitizeMetadata(meta);

    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(sanitized ? { meta: sanitized } : {}),
    };

    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  },

  debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  },

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  },

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  },

  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  },
};
