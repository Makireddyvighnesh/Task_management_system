import Comment from "../models/comment.js";

const getComments=async(req, res)=>{
    try {
        const comments=await Comment.find({});
        
        console.log(comments);
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json(error);
    }
}

const createComment=async (req, res)=>{
    const {name, comment, commentTime}=req.body;
    console.log(name, comment, commentTime)
    try {
        const response = new Comment({userName:name, comment, commentTime});
        const savedTask = await response.save();

        console.log(response)
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

export  {createComment, getComments};