import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room: String,
    messages: [
        {
            sender: String,
            receiver: String,
            content: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const MessageModel = mongoose.model('Messages', messageSchema);

export default MessageModel;
