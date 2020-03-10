var mongoonse = require('mongoose');
var Schema = mongoonse.Schema;

var UserSchema = new Schema ({
    id: Schema.Types.ObjectId,
    userName: String,
    room: String,
    timeStamp: Date,
    eventLog: String
},
{
    collection: 'user'
});

module.exports = mongoonse.model('User', UserSchema);