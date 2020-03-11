const express = require('express');
const router = express.Router();
const Message = require('../DB/MessageSchema');

// Add Message
router.route('/add-message').post((req, res, next) => {
    Message.create(req.body, (err, data) => {
        if (err) {
            return next(err);
        } else {
            return res.json(data);
        }
    });
});

// Get All Messages
router.route('/history').get((req, res) => {
    Message.find((err, data) => {
        if (err) {
            return next(err);
        } else {
            res.json(data);
        }
    });
});

//getMessageBasedRoom
router.route('/roomhistory').post((req, res) => {
    messageModel.find({ room: req.body.roomname }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    });
});

module.exports = router;