class StoreConfig {
  #logging = false;
  #logger = null;

  constructor(config = {}) {
    this.#logger = config.logger || null;
    this.#logging = config.isLoggingEnabled || false;
  }

  isLoggingEnabled() {
    return this.#logging;
  }

  getLogger() {
    return this.#logger;
  }
}

module.exports = { StoreConfig };
