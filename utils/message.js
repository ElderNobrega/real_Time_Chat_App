const moment = require('moment');

let generateMessage = (author, message) => {
    return {
        author,
        message,
        createdAt: moment().valueOf()
    };
};

module.exports = {generateMessage};