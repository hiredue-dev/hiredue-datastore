const { PersistentStore } = require("./persistentStore.cjs");
const { TransientStore } = require("./transientStore.cjs");
const { SecureStore } = require("./secureStore.cjs");
const { Store } = require("./store.cjs");
class DataStore {
  persistent;
  secure;
  transient;  
	constructor() {
      this.persistent = new PersistentStore();
      this.transient = new TransientStore();
      this.secure = new SecureStore();
	}
  async init(config = {}) {
    try {
      Store.initializeConfig(config.store || {});
      this.transient.init(config.transient || {});
      this.secure.init(config.secure || {});
      await this.persistent.init(config.persistent || {});
    } catch (error) {
      throw error;
    }
  }

}  
module.exports = DataStore;
