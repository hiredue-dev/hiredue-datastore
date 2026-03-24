const { StoreConfig } = require("./storeConfig.cjs");
class Store {
  static #consoleLogFallback = {
    info: (...args) => console.log(...args),
    warn: (...args) => console.log(...args),
    error: (...args) => console.log(...args),
    debug: (...args) => console.log(...args),
  };

  static #loggerProxy = {
    info: (...args) => {
      const logger = Store.getStoreConfig().getLogger();
      return (logger && typeof logger.info === "function" ? logger : Store.#consoleLogFallback).info(...args);
    },
    warn: (...args) => {
      const logger = Store.getStoreConfig().getLogger();
      return (logger && typeof logger.warn === "function" ? logger : Store.#consoleLogFallback).warn(...args);
    },
    error: (...args) => {
      const logger = Store.getStoreConfig().getLogger();
      return (logger && typeof logger.error === "function" ? logger : Store.#consoleLogFallback).error(...args);
    },
    debug: (...args) => {
      const logger = Store.getStoreConfig().getLogger();
      return (logger && typeof logger.debug === "function" ? logger : Store.#consoleLogFallback).debug(...args);
    },
  };

  static getConsoleLogFallback() {
    return Store.#consoleLogFallback;
  }

  static getLoggerProxy() {
    return Store.#loggerProxy;
  }

  constructor() {
    if (new.target === Store) {
      throw new Error("Store is abstract and cannot be instantiated directly");
    }
  }

  get(key) {
    throw new Error("get(key) must be implemented");
  }

  set(key, value) {
    throw new Error("set(key, value) must be implemented");
  }
  erase(key) {
    throw new Error("erase(key) must be implemented");
  }
  clear() {
    throw new Error("clear() must be implemented");
  }
  static #storeConfig = null;
  static initializeConfig(config = {}) {
    Store.#storeConfig = new StoreConfig(config);
  }
  static getStoreConfig() {
    if (!Store.#storeConfig) {
      Store.#storeConfig = new StoreConfig();
    }
    return Store.#storeConfig;
  }
  getUserId() {
    return Store.getStoreConfig().getUserId();
  }

  isLoggingEnabled() {
    return Store.getStoreConfig().isLoggingEnabled();
  }

  getLogger() {
    return Store.getStoreConfig().getLogger();
  }
  getLog() {
    if (!this.isLoggingEnabled()) {
      return Store.#consoleLogFallback;
    }

    const log = this.getLogger();
    if (log && typeof log.info === "function" && typeof log.warn === "function" && typeof log.error === "function" && typeof log.debug === "function") {
      return log;
    }

    return Store.#consoleLogFallback;
  }
}
module.exports = { Store };
