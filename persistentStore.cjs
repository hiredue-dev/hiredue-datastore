const storage = require("node-persist");
const { Store } = require("./store.cjs");
const log = Store.getLoggerProxy();

class PersistentStore extends Store {
  #store;

  constructor() {
    super();
  }

  async init(config) {
    try {
      const persist = storage.create(config);
			await persist.init();
      this.#store = persist;
      log.info("PersistentStore initialized", { dir: config && config.dir ? config.dir : undefined });
    } catch (error) {
      log.error("PersistentStore init failed", error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.#store.getItem(key);
  log.debug("PersistentStore.get", { key, found: value !== undefined && value !== null });
      return value;
    } catch (error) {
      log.error("PersistentStore.get failed", { key, error });
      throw error;
    }
  }

  async set(key, value) {
    try {
      const result = await this.#store.setItem(key, value);
      log.debug("PersistentStore.set", { key });
      return result;
    } catch (error) {
      log.error("PersistentStore.set failed", { key, error });
      throw error;
    }
  }

  async erase(key) {
    try {
      const result = await this.#store.removeItem(key);
      log.debug("PersistentStore.erase", { key });
      return result;
    } catch (error) {
      log.error("PersistentStore.erase failed", { key, error });
      throw error;
    }
  }

  async clear() {
    try {
      const result = await this.#store.clear();
      log.info("PersistentStore cleared");
      return result;
    } catch (error) {
      log.error("PersistentStore.clear failed", error);
      throw error;
    }
  }
}

module.exports = { PersistentStore };
