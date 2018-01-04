
// dependency inject config so that it can be mocked in the real app use var config = require('config');
function getDbConfig(config) {
  var dbConfig = config.get('Customer.dbConfig');
  return dbConfig;
}

module.exports = getDbConfig;
