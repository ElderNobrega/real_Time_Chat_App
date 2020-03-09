var mongoonse = require('mongoose');
var Schema = mongoonse.Schema;

var UserSchema = new Schema ({
    userId: Any,
    userName: Any,
    room: Any,
    timeStamp: Date,
    eventLog: String
});

module.exports = mongoonse.model('User', UserSchema);