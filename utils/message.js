let generateMessage = (author, message) => {
    return {
        author,
        message,
        createdAt: new Date().getTime
    };
};

module.exports = {generateMessage};