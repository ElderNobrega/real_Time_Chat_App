const mongoose = require('mongoose');
const guest = require('../DB/UserSchema');
const connectDB = require('../DB/connection');


class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room, event) {
        connectDB.then(db => {
            console.log(name);
            let guests = new guest({
                id: new mongoose.Types.ObjectId(),
                userName: name,
                room: room,
                timeStamp: new Date().getTime(),
                eventLog: event
            });
            guests.save();
        });

        let user = {id, name, room};
        this.users.push(user)
        console.log(user)
        return user;
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        let namesArr = users.map((user) => user.name);  
        return namesArr;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id) {
        let user = this.getUser(id);

        if(user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

}

module.exports = {Users};