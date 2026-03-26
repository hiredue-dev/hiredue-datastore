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
 
  async set(key, value) { 
		try{
      return keytar.setPassword(this.#SERVICE_NAME, key, value);
    } catch (error) {
      log.error("SecureStore.set failed", { key, error });
    }
  }

  async get(key) {
		try {
			return keytar.getPassword(this.#SERVICE_NAME, key);
		} catch (error) {
			log.error("SecureStore.get failed", { key, error });
		}  
	}

	async erase(key) {
    try {
      return keytar.deletePassword(this.#SERVICE_NAME, key);
    } catch (error) {
      log.error("SecureStore.erase failed", { key, error });
    }
  }

	async clear(prefix = null) {
		try {
			const credentials = await keytar.findCredentials(this.#SERVICE_NAME);

			let keysToDelete = credentials;
			if (prefix) {
				keysToDelete = credentials.filter(cred => cred.account.startsWith(prefix));
			}

			for (const cred of keysToDelete) {
				await keytar.deletePassword(this.#SERVICE_NAME, cred.account);
			}

			return true;
		} catch (error) {
			log.error("SecureStore.clear failed", error);
		}
	}
}

module.exports = {
  SecureStore
};
