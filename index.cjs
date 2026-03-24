const { PersistentStore } = require("./persistentStore.cjs");
const { TransientStore } = require("./transientStore.cjs");
const { SecureStore } = require("./secureStore.cjs");
const { Store } = require("./store.cjs");
class DataStore {
  persistent;
  secure;
  transient;  
  async init(config = {}) {
    try {
      Store.initializeConfig(config.store || {});
      this.persistent = PersistentStore.getInstance();
      this.transient = TransientStore.getInstance();
      this.secure = SecureStore.getInstance();
      await this.persistent.init(config.persistent || {});
      await this.transient.init(config.transient || {});
      await this.secure.init(config.secure || {});
    } catch (error) {
      throw error;
    }
  }

}  
module.exports = DataStore;