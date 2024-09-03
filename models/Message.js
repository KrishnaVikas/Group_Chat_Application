import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    messageContent: {
        type: String,
        required: true
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Message", messageSchema);