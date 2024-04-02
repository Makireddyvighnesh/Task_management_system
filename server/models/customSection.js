import mongoose from "mongoose";

const customSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }, tasks:[{
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            default:'',
        },
        dueDate:{
            type:Date,
        },
        priority:{
            type:String,
            default:'p1'
        },
        completed:{
            type:Boolean,
            default:false,
        },
        recurringTask:{
            type:Boolean,
            default:false,
        },
        taskCompleted:{
            type:Date,
        },
    }],
    userEmail:{
        type:String,
        required:true,
    }
});

const Custom=new mongoose.model('Custom',customSchema);

export default Custom;