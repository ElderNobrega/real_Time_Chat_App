var mongoonse = require('mongoose');
var Schema = mongoonse.Schema;

var msgSchema = new Schema ({
    sender: String,
    room: String,
    timeStamp: Date,
    message: String
},
{
    collection: 'msg'
});

module.exports = mongoonse.model('Message', msgSchema);