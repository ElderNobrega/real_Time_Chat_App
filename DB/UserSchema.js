var mongoonse = require('mongoose');
var Schema = mongoonse.Schema;

var UserSchema = new Schema ({
    id: mongoose.Schema.Types.ObjectId,
    userName: String,
    room: String,
    timeStamp: Date,
    eventLog: String
});

module.exports = mongoonse.model('User', UserSchema);