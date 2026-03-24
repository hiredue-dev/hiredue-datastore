const keytar = require("keytar");
const { Store } = require("./store.cjs");
const log = Store.getLoggerProxy();

class SecureStore extends Store {
  static #instance;
  #SERVICE_NAME = '';
  constructor() {
    if (SecureStore.#instance) {
      return SecureStore.#instance;
    }
    super();
    SecureStore.#instance = this;
  }

  static getInstance() {
    if (!SecureStore.#instance) {
      SecureStore.#instance = new SecureStore();
    }
    return SecureStore.#instance;
  }
  init(config) {
    try {
      if (config.serviceName) this.#SERVICE_NAME = config.serviceName;
      log.info("SecureStore initialized", { serviceName: this.#SERVICE_NAME || "<empty>" });
    } catch (error) {
      log.error("SecureStore initialization failed", error);
      
    }
  }
 
  toIdKey(id, key) {
    return `${id}:${key}`;
  }
 
  async set(key, value) { 
    try {
      if (typeof key === 'object' && key.id && key.name) {
        const combined = this.toIdKey(key.id, key.name);
        return keytar.setPassword(this.#SERVICE_NAME, combined, value);
      }
      return keytar.setPassword(this.#SERVICE_NAME, key, value);
    } catch (error) {
      log.error("SecureStore.set failed", { key, error });
      
    }
  }

  async get(key) {
    try {
      if (typeof key === 'object' && key.id && key.name) {
        const combined = this.toIdKey(key.id, key.name);
        return keytar.getPassword(this.#SERVICE_NAME, combined);
      }
      return keytar.getPassword(this.#SERVICE_NAME, key);
    } catch (error) {
      log.error("SecureStore.get failed", { key, error });
      
    }
  }

  async erase(key) {
    try {
      if (typeof key === 'object' && key.id && key.name) {
        const combined = this.toIdKey(key.id, key.name);

        return keytar.deletePassword(this.#SERVICE_NAME, combined);
      }
      return keytar.deletePassword(this.#SERVICE_NAME, key);
    } catch (error) {
      log.error("SecureStore.erase failed", { key, error });
      
    }
  }

  async clear() {
    try {
      const credentials = await keytar.findCredentials(this.#SERVICE_NAME);
      for (const cred of credentials) {
        await keytar.deletePassword(this.#SERVICE_NAME, cred.account);
      }
      return true;
    } catch (error) {
      log.error("SecureStore.clear failed", error);
    }
  } 
 
  async saveSecret(key, value) {
    try {
      const userId = this.getUserId();
      if (!userId) {
          log.error("SecureStore.saveSecret failed: missing userId in store config", { key });
          return null;
      }

      const account = this.toIdKey(userId, key);
      

      const result = await keytar.setPassword(this.#SERVICE_NAME, account, value);
      log.debug("SecureStore.saveSecret completed", { key, userId });
      return result;
    } catch (error) {
      log.error("SecureStore.saveSecret failed", { key, error });
      
    }
  }

 
  async getSecret(key) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        log.error("SecureStore.getSecret failed: missing userId in store config", { key });
        return null;
      }

      const account = this.toIdKey(userId, key);
      

      const value = await keytar.getPassword(this.#SERVICE_NAME, account);
      log.debug("SecureStore.getSecret completed", { key, userId, found: value !== null });
      return value;
    } catch (error) {
      log.error("SecureStore.getSecret failed", { key, error });
      
    }
  }


  async deleteSecret(key) {
    try {
      const userId = this.getUserId();
      if (!userId) {
        log.error("SecureStore.deleteSecret failed: missing userId in store config", { key });
        return null;
      }

      const account = this.toIdKey(userId, key);
      

      const deleted = await keytar.deletePassword(this.#SERVICE_NAME, account);
      log.debug("SecureStore.deleteSecret completed", { key, userId, deleted });
      return deleted;
    } catch (error) {
      log.error("SecureStore.deleteSecret failed", { key, error });
  
    }
  }


  async clearAllSecrets() {
    try {
      const userId = this.getUserId();
      if (!userId) {
        const msg = "userId is required but not available in Store config";
        log.error("SecureStore.clearAllSecrets failed: missing userId in store config", { userId });
        return null;
      }

      const credentials = await keytar.findCredentials(this.#SERVICE_NAME);
      const userPrefix = this.toIdKey(userId, "");
      
      for (const cred of credentials) {
        if (cred.account.startsWith(userPrefix)) {
          await keytar.deletePassword(this.#SERVICE_NAME, cred.account);
        }
      }
      log.info("SecureStore.clearAllSecrets completed", { userId });
      return true;
    } catch (error) {
      log.error("SecureStore.clearAllSecrets failed", error);
      
    }
  }
}

module.exports = {
  SecureStore
};
