const leanengine = require('leanengine');

leanengine.init({
  appId: process.env.LC_APP_ID,
  appKey: process.env.LC_APP_KEY,
  masterKey: process.env.LC_APP_MASTER_KEY
});
leanengine.Cloud.useMasterKey();

module.exports = leanengine;
