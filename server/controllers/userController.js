import User from "../models/userModel.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const createToken=(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'} );
}

//signin user
const signinUser=async(req, res)=>{
    const {email, password}=req.body;
    try{
        const user=await User.login(email, password);
        console.log(user)
        const token=createToken(user._id);
        console.log(token)
        const userName=user.userName;
        const groupName=user.groupName;
        console.log(email, token, userName);
        console.log("lasted")
        res.status(200).json({email,userName,groupName, token});
    } catch(error){
        res.status(400).json({error:error.message});
    }

}

const updateGoal=async(req, res)=>{
    const user_id=req.user_id;
    try {
        const response=await User.findByIdAndUpdate({_id:user_id}, {$set:{dailyGoal:dailyGoal, weeklyGoal:weeklyGoal}});
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

//signup user
const signupUser=async(req, res)=>{
    const {userName,email, password}=req.body;
    try{
        const user=await User.signup(userName,email, password);
        const token=createToken(user._id);
        console.log(email, token);
        res.status(200).json({email, userName, token});
    } catch(error){
        res.status(400).json({error:error.message});
    }
    
}

export {signinUser, signupUser};