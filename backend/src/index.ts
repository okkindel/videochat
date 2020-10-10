import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import {v4} from 'uuid';


const app = express();
const server = new http.Server(app);
const io = socketIO(server);



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect(`/${v4()}`));
app.get('/:room', (req, res) => res.render('index', { roomId: req.params.room }));

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

const instance = server.listen(3000);
