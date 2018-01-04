
// dependency inject config so that it can be mocked in the real app use var config = require('config');
function getDbConfig(config, key) {
  var dbConfig = config.get(key);
  return dbConfig;
}

module.exports = getDbConfig;
