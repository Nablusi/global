import MessageModel from "../models/chat";
import UserModel from "../models/user";

export const getMessages = async (req, res) => {
    const { room } = req.params;
    try {
        const findRoom = await MessageModel.findOne({ room });
        if (!findRoom) {
            return res.status(404).json({
                message: 'Room does not exist',
            });
        }

        const messages = findRoom.messages.map(message => ({
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,
            timestamp: message.timestamp,
        }));

        res.status(200).json({
            messages,
            sender: findRoom.sender,
            receiver: findRoom.receiver,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
        console.error("Error in retrieving messages " + error);
    }
};

export const addMessage = async (req, res) => {
    const { room } = req.params;
    const { sender, receiver, message } = req.body;
    try {
        let findRoom = await MessageModel.findOne({ room });

        const findSender = await UserModel.findOne({ username: sender });
        if (!findSender) {
            return res.status(404).json({
                message: 'Sender does not exist',
            });
        }

        const findReceiver = await UserModel.findOne({ username: receiver });
        if (!findReceiver) {
            return res.status(404).json({
                message: 'Receiver does not exist',
            });
        }

        if (!findRoom) {
            findRoom = await MessageModel.create({
                sender: findSender.username,
                receiver: findReceiver.username,
                room,
                messages: [],
            });
        }

        findRoom.messages.push({
            sender: findSender.username,
            receiver: findReceiver.username,
            content: message,
        });

        await findRoom.save();

        const messages = findRoom.messages.map(message => ({
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,
            timestamp: message.timestamp,
        }));

        res.status(200).json({
            messages,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
        console.error('Error in Adding Messages ' + error);
    }
};
