class StoreConfig {
  #userId = null;
  #logging = false;
  #logger = null;

  constructor(config = {}) {
    this.#logger = config.logger || null;
    this.#logging = config.isLoggingEnabled || false;
    this.#userId = config.userId || null;
  }

  getUserId() {
    return this.#userId;
  }
  isLoggingEnabled() {
    return this.#logging;
  }

  getLogger() {
    return this.#logger;
  }
}

module.exports = { StoreConfig };
