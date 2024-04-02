import Group from "../models/group.js";
import User from "../models/userModel.js";
import { sendNotification } from "./notificationController.js";

import cron from 'node-cron';
async function sendMessage() {
    try {
        const groupUsers=await Group.find({groupName:"Project Group"},{users:1});
        console.log(groupUsers[0].users);
        const email=await User.findOne({userName:groupUsers[0].users});
        console.log(email.email);
        await sendNotification(email.email,'', "group")
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('0 0 * * *', sendMessage);


const getAllUsers=async (req, res)=>{
        const {groupName}=req.params;
        console.log(groupName)
        try{
            let users=await Group.find({groupName:groupName});
            console.log(users)
            // users=users[0].users;
            res.status(200).json({users});
        } catch(err){
            res.status(400).json(err);
        }
}

const admin=async (req, res)=>{
    const {admin,email, groupName}=req.body;
    console.log(admin,email, groupName);
    try{
        // const adminName=await User.find({email:email},{userName:1});
        await User.updateOne({userName:admin},{$set:{groupName:groupName}});
        const response= new Group({admin:admin, groupName:groupName});

        const savedAdmin=await response.save();
        console.log(response);
        res.status(200).json({message:'Successfully added admin'});
    } catch(err){
        res.status(400).json(err);
    }
}

const addUser=async (req, res)=>{

    const {groupName,userDetails}=req.body;
    console.log(userDetails.email, groupName)
    try{
      
        const response=await User.find({email:userDetails.email});
        console.log(response)
        if(response){
            const adduser=await Group.updateOne({groupName:groupName},{$push:{users:response[0].userName}})
            console.log(adduser);
            const updateUser=await User.updateOne({email:userDetails.email},{$set:{groupName:groupName}})
            console.log(updateUser);
        }
        res.status(200).json(response[0].userName);
    } catch(err){
        res.status(404).json({message:'User need to be registered'});
    }
}

const assignTasks = async (req, res) => {
//    console.log(req.file.filename); 
//    console.log(req.body)
   const {title, description, due,priority, gName}=req.body;
   const fileName=req.file.filename;
    try {

        // const { gName}=req.body;
        const newTask = {
            title: title,
            description: description,
            priority: priority, 
            dueDate: due, 
            pdf: fileName,
            completed: false,
          };
        //   console.log(newTask);
          const get=await Group.findOne({groupName:gName});
        //   console.log(get)
        const response=await Group.updateOne(
            { groupName: gName },
            { $push: { tasks: newTask } }
          );
    //   console.log(response);
      await sendMessage();
      res.status(200).json({ message: "Successful" });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  };
  

const updateTask=async(req, res)=>{
    const {groupName,editingTask, title}=req.body;
    console.log("ju")
    console.log(req.body);
    try{
        const response=await Group.updateOne({groupName:groupName, 'tasks.title':title, 'tasks.completed':false},{$set:{'tasks.$.title':editingTask.title,'tasks.$.description':editingTask.description, 'tasks.$.priority':editingTask.priority, 'tasks.$.dueDate':editingTask.dueDate, 'tasks.$.completed':editingTask.completed }})
        res.status(200).json(response);
    } catch(err){
        res.status(400).json(err);
    }
}

const deleteTask=async(req, res)=>{
    const {groupName,title}=req.params;
    console.log("Hey")
    console.log(req.params);
    try{
        const response=await Group.updateOne({groupName:groupName, 'tasks.title':title},{$set:{'tasks.$.completed':true}});
        console.log(response);
        res.status(200).json(response);
    } catch(err){
        console.log(err);
        res.status(400).json({message:err})
    }
}
 
export {addUser,  admin, assignTasks, getAllUsers, deleteTask, updateTask};