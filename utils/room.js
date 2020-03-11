const rooms = [];

function room(room) {
    if (!rooms.includes(room)) {
        rooms.push(room)
    }
}

function getRooms() {
    return rooms;
}

module.exports = {room, getRooms}