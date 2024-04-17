'user strict';

const s = require('../static_random'); //random static

const user_list = [];

exports.cari_pasangan = function (userId, socket, io) {
    user_list.push({ userId, socketId: socket.id, socket: socket });
    console.log(user_list.length);
    if (user_list.length >= 2) {
        const partner1 = user_list.pop();
        const partner2 = user_list.pop();
        const room = `${partner1.userId}_${partner2.userId}`;
        io.to(partner1.socketId).emit(s.di_temukan, room);
        io.to(partner2.socketId).emit(s.di_temukan, room);
    }
}

exports.batal_cari_pasangan = function (socket) {
    const index = user_list.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
        user_list.splice(index, 1);
    }
    console.log(user_list.length);
}

exports.di_temukan = function (socket, room) {
    const index = user_list.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
        socket.join(room);
        user_list.splice(index, 1);
        console.log(user_list.length);
    }
}

exports.join_room = function (socket, room) {
    if (!socket.rooms.has(room)) {
        socket.join(room);
        console.log(socket.id, s.join_room, room);
    }
}

exports.pesan = function (data, io) {
    io.to(data['id']).emit(s.pesan, data);
}

exports.hapus_pesan = function (data, io) {
    io.to(data['id']).emit(s.hapus_pesan, data);
}

exports.read_status = function (data, io) {
    io.to(data['id']).emit(s.read_status, data);
}

exports.mengetik = function (data, io) {
    io.to(data['id']).emit(s.mengetik, data);
}

exports.status_online = function (data, io) {
    io.to(data['id']).emit(s.status_online, data);
}

exports.keluar_room = function (data, io, socket) {
    io.to(data['id']).emit(s.keluar_room, data);
    socket.leave(data['id']);
}
