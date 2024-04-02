import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    comment:{
        type:String
    },
    commentTime:{
        type:Date    
    }
})

const Comment=new mongoose.model('Comment', commentSchema);

export default Comment;