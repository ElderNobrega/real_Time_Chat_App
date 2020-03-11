const express = require('express');
const router = express.Router();
const users = require('../DB/UserSchema');

// Add Log
router.route('/add-log').post((req, res, next) => {
    users.create(req.body, (err, data) => {
        if (err) {
            return next(err);
        } else {
            return res.json(data);
        }
    });
});

// Get All Logs
router.route('/eventlog').get((req, res) => {
    users.find((err, data) => {
        if (err) {
            return next(err);
        } else {
            res.json(data);
        }
    });
});

module.exports = router;