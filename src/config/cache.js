const NodeCache = require("node-cache");

// Initialize cache with a default TTL of 5 minutes (300 seconds)
// checkperiod: period in seconds for the delete check interval.
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = myCache;
