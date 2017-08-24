var mongoose = require('mongoose');
var data = require('./data.js');
var queries = require('./queries.js');
var Schema = mongoose.Schema;

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/friendzone2',
  {
    useMongoClient: true
  }
);

var db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

var userSchema = mongoose.Schema({
  twitter_id: {type: Number, unique: true},
  username: {type: String, unique: true},
  twitter_url: String,
  fullname: String,
  location: String,
  hobbies: String,
  profile_img: String,
  about_me: String,
  matches: [Number],
  following: [Number],
  friends: [Number],
  blocked: [Number],
  pending_approval: [Number],
  pending_request: [Number]
});

var messageSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  createdAt: {type:Date , default: Date.now}
});

var sessionSchema = mongoose.Schema({
  hash: String,
  user_id: Number
}, {timestamps: true}); //built in timestamps for createdAt and updatedAt

module.exports.User = mongoose.model('User', userSchema);
module.exports.Message = mongoose.model('Message', messageSchema);
module.exports.Session = mongoose.model('Session', sessionSchema);

module.exports.User.remove({}, () => {
  module.exports.User.collection.insertMany(data.userData, (err, results) => {
    if (err) {
      console.log('********* user data insert error ', err);
    } else {
      console.log('********** user data insert success results ', results);
      module.exports.Message.remove({}, () => {
        module.exports.Message.collection.insertMany(data.messageData, (err, results) => {
          if (err) {
            console.log('********* message data insert error ', err);
          }
          else {
            console.log('********** message data insert success results ', results);
            module.exports.Session.remove({}, () => {
              module.exports.Session.collection.insertMany(data.sessionData, (err, results) => {
                if (err) {
                  console.log('********* session data insert error ', err);
                }
                else {
                  console.log('********** session data insert success results ', results);
                  console.log('*********** db cleared ');
                }
              });
            });
          }
        });
      });
    }
  });
});
