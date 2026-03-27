const DataStore = require("./index.cjs");
const a = new DataStore();
const b = new DataStore();
console.log(a.persistent == b.persistent)
