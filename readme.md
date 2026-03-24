# Data Store
This is a javascript based implementation of a data store that can be used to store and retrieve data. It is implemented as a singleton class that uses the `node-persist` library for the persistent store and `node-cache` for the transient store. The secure store is implemented using the `keytar` library. The data store can be configured to enable or disable user scoping, logging, and other features. It also supports TTL (time to live) for the transient store and the persistent store. The Persistent store also has a write queue feature that allows for asynchronous writes to the persistent store. The data store can be used in a variety of applications, including web applications, desktop applications, and mobile applications.
## Usage
To use the data store, you can import the `DataStore` class and create an instance of it. You can then create a config file that would be used to initialize the data store. The config file should be a JSON that contains the following keys:
```javascript
const storeConfig = {
  store: {
    enableUserScoping: true,
    userId : userId,
    isLoggingEnabled : true,
    logger : log 
  },
  persistent: {
    dir: persistentStoreDir,
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: false,
    ttl: false,
    expiredInterval: 2 * 60 * 1000,
    forgiveParseErrors: false,
    writeQueue: true,
    writeQueueIntervalMs: 1000,
    writeQueueWriteOnlyLast: true
  },
  transient: {
    ttl: 1200
  },
  secure: {
    serviceName: appName
  }
};
```
You can then initialize the data store with the config file and use it to store and retrieve data. For example:
```javascript
const dataStore = new DataStore();
await dataStore.init(storeConfig);
```

You can then use the `set` and `get` methods to store and retrieve data. For example:
```javascript
await dataStore.persistent.set("key", "value");
const value = await dataStore.persistent.get("key");
console.log(value); // "value"
```
You can also use the `transient` and `secure` stores in a similar way. For example:
```javascript 
await dataStore.transient.set("key", "value123");
const value = await dataStore.secure.get("cognitoKey"); 
```

The store config can be customized to enable or disable user scoping, logging, and other features. You can also specify the directory for the persistent store and the encoding for the data. The data store is designed to be flexible and can be used in a variety of applications. It provides a simple API for storing and retrieving data, and it can be easily integrated into your application.

# License
MIT License