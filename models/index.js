const mongoose = require('mongoose');

module.exports.connect = (uri) => {
  //mongoose.connect('mongodb://localhost:27017/xien5');

  mongoose.connect(uri, { useMongoClient: true});
  // plug in the promise library:
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });

  // load models
  require('./result');
  require('./user');
  require('./member');
  require('./blog');
  require('./member_transaction');
  require('./withdraw');
  require('./setting');
  require('./bank');
  require('./member_bet');
  require('./fun');
  require('./card');
};