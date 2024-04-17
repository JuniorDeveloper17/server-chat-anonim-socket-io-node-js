'user strict';

const s = require('./controller/static_random'); //random static
const random = require('./controller/random/socket_random'); //random controller

const user_online = [];

module.exports = function (io) {

    io.on('connection', (socket) => {
        console.log(socket.id, 'connected');

        socket.on(s.cari_pasangan, (userId) => {
            random.cari_pasangan(userId, socket, io);
        });

        socket.on(s.batal_cari_pasangan, () => {
            random.batal_cari_pasangan(socket);
        });

        socket.on(s.di_temukan, (room) => {
            random.di_temukan(socket, room);
        });

        socket.on(s.join_room, (data) => {
            random.join_room(socket, data);
        });

        socket.on(s.pesan, (data) => {
            random.pesan(data, io);
        });

        socket.on(s.hapus_pesan, (data) => {
            random.hapus_pesan(data, io);
        });

        socket.on(s.mengetik, (data) => {
            random.mengetik(data, io);
        });

        socket.on(s.read_status, (data) => {
            random.read_status(data, io);
        });

        socket.on(s.status_online, (data) => {
            random.status_online(data, io);
        });

        socket.on(s.keluar_room, (data) => {
            random.keluar_room(data, io, socket);
        });

        socket.on(s.user_online, (data) => {
            if (!socket.rooms.has(data['room'])) {
                if (!user_online.includes(socket.id)) {
                    socket.join(data['room']);
                    user_online.push(socket.id);
                    console.log(user_online.length);
                    io.to(data['room']).emit(s.user_online, user_online.length);
                } else {
                    console.log(`${data['sender']} sudah join di ${data['room']}`);
                }
            }
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
            const index = user_online.findIndex((user) => user === socket.id);
            if (index !== -1) {
                user_online.splice(index, 1);
                io.to(s.user_online).emit(s.user_online, user_online.length);
            } else {
                console.log('tidak ada user online');
            }
        });
    });
}