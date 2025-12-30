import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    lectureId: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;