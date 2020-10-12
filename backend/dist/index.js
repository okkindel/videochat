"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const socket_io_1 = __importDefault(require("socket.io"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const key = fs_1.default.readFileSync(__dirname + '/../certs/selfsigned.key');
const cert = fs_1.default.readFileSync(__dirname + '/../certs/selfsigned.crt');
const options = {
    key,
    cert
};
const app = express_1.default();
const server = https_1.default.createServer(options, app);
const io = socket_io_1.default(server);
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
app.get('/', (req, res) => res.redirect(`/${uuid_1.v4()}`));
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
//# sourceMappingURL=index.js.map