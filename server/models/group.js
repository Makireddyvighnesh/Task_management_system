import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: {
      type: String,
      required: true,
    },
    admin: {
      type: String,
    },
    users: [{ type: String }],
    tasks: [{
      title: String,
      description: String,
      priority: String,
      dueDate: Date,
      pdf:String,
      completed: Boolean
    }],
  });
  
  const Group = new mongoose.model('Group', groupSchema);
  
  export default Group;
  