require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
import router from './router/router';
const bodyParser = require('body-parser');
const http = require('http');
import { Server } from 'socket.io';
import UserModel from './models/user';
import MessageModel from './models/chat';

// Database connection starts
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});
// Database connection ends

export const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credential: true
}));

app.use('/', router);

app.get("/", (req,res)=>{
    res.json("hello"); 
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
});

let activeUsers = [];
let typingUser = [];
let userSeen = [];

io.on('connection', (client) => {
    client.on('new-user-add', (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                clientId: client.id
            })
            console.log("New User Connected", activeUsers);
        }

        io.emit('get-users', activeUsers);
    });

    client.on('disconnect', () => {
        activeUsers = activeUsers.filter((user) => user.clientId !== client.id);
        // typingUser = typingUser.filter((user)=> user.userThatTyping  !== userThatTyping);
        console.log("User Disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    });

    client.on('get-contacts', async (data) => {
        const regex = new RegExp(`^${data}`, 'i');
        const users = await UserModel.find({ username: { $regex: regex } });

        if (users.length === 0) {
            return console.log('No users found with the specified letter');
        }

        const userContacts = users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        }));

        client.emit('send-contact', userContacts);
    });

    client.on('join-room', (room) => {
        client.join(room);
    });



    client.on('send-message', async (data) => {
        try {
            const sender = await UserModel.findOne({ username: data.userThatSendMessage });
            if (!sender) {
                console.log('user that sending message not found in database');
                client.emit('message-failure', { error: 'User not found' });
                return;
            }
            const receiver = await UserModel.findOne({ username: data.userThatReceivedMessage });
            if (!receiver) {
                console.log('user that receive message not found in database');
                client.emit('message-failure', { error: 'Receiver not found' });
                return;
            }

            console.log(data);

            io.to(data.room).emit('received-message', {
                userThatReceivedMessage: data.userThatReceivedMessage,
                room: data.room,
                message: data.message,
                userThatSendMessage: data.userThatSendMessage
            });
            client.emit('message-success', { message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error processing send-message event:', error);
            client.emit('message-failure', { error: 'Internal server error' });
        }
    });

    client.on('is-typing', (data) => {
        const { userThatTyping, text } = data;
        const userIndex = typingUser.findIndex(user => user.userThatTyping === userThatTyping);

        if (userIndex === -1) {
            typingUser.push({
                userThatTyping: userThatTyping,
                isTyping: true,
            });

            console.log(userThatTyping + " is Typing ", typingUser);
        } else {
            if (text !== '') {
                typingUser[userIndex].isTyping = true;
            } else {
                typingUser[userIndex].isTyping = false;
            }

            console.log(userThatTyping + " is Typing ", typingUser);
        }
        client.emit('typing', typingUser);




    });





});


server.listen(process.env.PORT, () => {
    console.log("app is listening to " + process.env.PORT);
});





