const fs = require('fs');
const path = require('path');

// Configurações de log
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_FILE = process.env.LOG_FILE || 'logs/ai-expense-control.log';

// Níveis de log
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Classe Logger para o sistema de IA de controle de gastos
 */
class Logger {
  constructor() {
    this.level = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;
    this.ensureLogDirectory();
  }

  /**
   * Garante que o diretório de logs existe
   */
  ensureLogDirectory() {
    const logDir = path.dirname(LOG_FILE);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Formata mensagem de log
   * @param {string} level - Nível do log
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   * @returns {string} - Mensagem formatada
   */
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    
    let formattedMessage = `[${timestamp}] ${levelUpper}: ${message}`;
    
    if (data) {
      if (typeof data === 'object') {
        formattedMessage += ` | ${JSON.stringify(data)}`;
      } else {
        formattedMessage += ` | ${data}`;
      }
    }
    
    return formattedMessage;
  }

  /**
   * Escreve log no arquivo
   * @param {string} message - Mensagem formatada
   */
  writeToFile(message) {
    try {
      fs.appendFileSync(LOG_FILE, message + '\n');
    } catch (error) {
      console.error('Erro ao escrever no arquivo de log:', error);
    }
  }

  /**
   * Escreve log no console com cores
   * @param {string} level - Nível do log
   * @param {string} message - Mensagem formatada
   */
  writeToConsole(level, message) {
    const colorMap = {
      error: colors.red,
      warn: colors.yellow,
      info: colors.green,
      debug: colors.blue
    };

    const color = colorMap[level] || colors.white;
    console.log(`${color}${message}${colors.reset}`);
  }

  /**
   * Log de erro
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  error(message, data = null) {
    if (LOG_LEVELS.error <= this.level) {
      const formattedMessage = this.formatMessage('error', message, data);
      this.writeToConsole('error', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de aviso
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  warn(message, data = null) {
    if (LOG_LEVELS.warn <= this.level) {
      const formattedMessage = this.formatMessage('warn', message, data);
      this.writeToConsole('warn', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de informação
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  info(message, data = null) {
    if (LOG_LEVELS.info <= this.level) {
      const formattedMessage = this.formatMessage('info', message, data);
      this.writeToConsole('info', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de debug
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  debug(message, data = null) {
    if (LOG_LEVELS.debug <= this.level) {
      const formattedMessage = this.formatMessage('debug', message, data);
      this.writeToConsole('debug', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de sucesso
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  success(message, data = null) {
    if (LOG_LEVELS.info <= this.level) {
      const formattedMessage = this.formatMessage('success', message, data);
      this.writeToConsole('info', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de processamento
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  processing(message, data = null) {
    if (LOG_LEVELS.info <= this.level) {
      const formattedMessage = this.formatMessage('processing', message, data);
      this.writeToConsole('info', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de API
   * @param {string} method - Método HTTP
   * @param {string} endpoint - Endpoint
   * @param {number} statusCode - Código de status
   * @param {number} responseTime - Tempo de resposta
   */
  api(method, endpoint, statusCode, responseTime = null) {
    if (LOG_LEVELS.info <= this.level) {
      const message = `${method} ${endpoint} - ${statusCode}`;
      const data = responseTime ? { responseTime: `${responseTime}ms` } : null;
      const formattedMessage = this.formatMessage('api', message, data);
      this.writeToConsole('info', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de performance
   * @param {string} operation - Operação
   * @param {number} duration - Duração em ms
   * @param {Object} data - Dados adicionais
   */
  performance(operation, duration, data = null) {
    if (LOG_LEVELS.info <= this.level) {
      const message = `${operation} - ${duration}ms`;
      const formattedMessage = this.formatMessage('performance', message, data);
      this.writeToConsole('info', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de segurança
   * @param {string} message - Mensagem
   * @param {Object} data - Dados adicionais
   */
  security(message, data = null) {
    if (LOG_LEVELS.warn <= this.level) {
      const formattedMessage = this.formatMessage('security', message, data);
      this.writeToConsole('warn', formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  /**
   * Log de erro não tratado
   * @param {Error} error - Erro
   * @param {Object} context - Contexto
   */
  unhandledError(error, context = {}) {
    const message = `Erro não tratado: ${error.message}`;
    const data = {
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };
    
    this.error(message, data);
  }

  /**
   * Limpa logs antigos
   * @param {number} daysToKeep - Dias para manter
   */
  cleanOldLogs(daysToKeep = 30) {
    try {
      if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        const fileAge = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (fileAge > daysToKeep) {
          // Criar backup antes de limpar
          const backupPath = LOG_FILE.replace('.log', `.backup.${Date.now()}.log`);
          fs.copyFileSync(LOG_FILE, backupPath);
          
          // Limpar arquivo atual
          fs.writeFileSync(LOG_FILE, '');
          
          this.info(`Logs antigos limpos. Backup criado em: ${backupPath}`);
        }
      }
    } catch (error) {
      this.error('Erro ao limpar logs antigos:', error);
    }
  }

  /**
   * Obtém estatísticas dos logs
   * @returns {Object} - Estatísticas
   */
  getLogStats() {
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        const stats = {
          total_lines: lines.length,
          file_size: fs.statSync(LOG_FILE).size,
          last_modified: fs.statSync(LOG_FILE).mtime,
          error_count: lines.filter(line => line.includes('ERROR')).length,
          warn_count: lines.filter(line => line.includes('WARN')).length,
          info_count: lines.filter(line => line.includes('INFO')).length,
          debug_count: lines.filter(line => line.includes('DEBUG')).length
        };
        
        return stats;
      }
      
      return {
        total_lines: 0,
        file_size: 0,
        last_modified: null,
        error_count: 0,
        warn_count: 0,
        info_count: 0,
        debug_count: 0
      };
      
    } catch (error) {
      this.error('Erro ao obter estatísticas dos logs:', error);
      return null;
    }
  }
}

// Instância global do logger
const logger = new Logger();

module.exports = { logger };
