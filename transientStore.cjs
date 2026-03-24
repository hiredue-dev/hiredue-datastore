const NodeCache = require( "node-cache" );
const { Store } = require( "./store.cjs" );
const log = Store.getLoggerProxy();
class TransientStore extends Store {
    static #instance;
    #cache;
    #ttl = 1200;
    constructor(){ 
        if(TransientStore.#instance){
            return TransientStore.#instance;
        }
        super();
        this.#cache = new NodeCache();
        TransientStore.#instance = this;
    }
    static getInstance() {
        if (!TransientStore.#instance) {
            TransientStore.#instance = new TransientStore();
        }
        return TransientStore.#instance;
    }
    init(config){
        try {
            if (config.ttl) this.#ttl = config.ttl;
           
           log.info("TransientStore initialized", { ttl: this.#ttl });
        } catch (error) {
            log.error("TransientStore init failed", error);
            throw error;
        }
    }
    set(key, value){
        try {
            this.#cache.set(key, value, this.#ttl);
            log.debug("TransientStore.set", { key, ttl: this.#ttl });
        } catch (error) {
            log.error("TransientStore.set failed", { key, error });
            throw error;
        }
    }
    get(key){
        try {
            const value = this.#cache.get(key);
            log.debug("TransientStore.get", { key, found: value !== undefined });
            return value;
        } catch (error) {
            log.error("TransientStore.get failed", { key, error });
            throw error;
        }
    }
    erase(key){
        try {
            this.#cache.del(key);
            log.debug("TransientStore.erase", { key });
        } catch (error) {
            log.error("TransientStore.erase failed", { key, error });
            throw error;
        }
    }
    clear(){
        try {
            this.#cache.flushAll();
            log.info("TransientStore cleared");
        } catch (error) {
            log.error("TransientStore.clear failed", error);
            throw error;
        }
    }
}
module.exports = { TransientStore };