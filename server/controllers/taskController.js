import Task from "../models/task.js";
import User from "../models/userModel.js"
import { sendNotification } from "./notificationController.js";

import cron from 'node-cron';
let user_id;
let email;

async function sendTaskReminders() {
    console.log("called ")
    // await getAllTasks()
    try {
        const tasks = await Task.find({
            user_id: user_id,
            dueDate: {
                $gte: new Date(),
                $lt: new Date(new Date().setDate(new Date().getDate() + 1)),
            },
            reminderSent: { $ne: true } // Check if reminder has not been sent
        });

        console.log("tasks are", tasks, user_id);

        for (const task of tasks) {
            await sendNotification(email, task.title);

            // Mark the task as a reminder sent
            await Task.findByIdAndUpdate({ _id: task._id }, { $set: { reminderSent: true } });
        }

        console.log('Task due date reminders sent');
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('0 * * * *', sendTaskReminders);


const getAllTasks = async (req, res) => {
    user_id=req.user._id;
    email=req.user;
    try {
        const userGoals=await User.findOne({_id:user_id});
        console.log(userGoals.dailyGoal)
        // await sendTaskReminders();
        const recurTasks=await Task.find({ user_id: req.user._id, recurringTask:true});
        const tasks = await Task.find({ user_id: req.user._id, completed: false });
        const extractDateAndTime = (dueDate) => {
            if (!dueDate) {
                return { date: null, time: null };
            }
            const date = dueDate.toISOString().split('T')[0];
            const time = dueDate.toISOString().split('T')[1].split('.')[0];
            return { date, time };
        };
        const isWithinCurrentWeek = (date) => {
            const currentDate = new Date();
            const firstDayOfWeek = new Date(currentDate);
            firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            return date >= firstDayOfWeek && date <= lastDayOfWeek;
        };
        const formatTime = (dueDate) => {
            return dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        };

        const processedRecurTasks = recurTasks.map(task => {
            const { date, time } = extractDateAndTime(task.dueDate);
            if (!date) {
                return { ...task.toObject(), date: null, time: null, day: null };
            }
            const formattedTime = formatTime(task.dueDate);
            const dueDate = new Date(date);
            const isCurrentWeek = isWithinCurrentWeek(dueDate);
            const day = isCurrentWeek ? dueDate.toLocaleDateString(undefined, { weekday: 'long' }) : null;
            return { ...task.toObject(), date: isCurrentWeek ? day : date, time: formattedTime, day: isCurrentWeek ? null : day };
        });

        const processedTasks = tasks.map(task => {
            const { date, time } = extractDateAndTime(task.dueDate);
            if (!date) {
                return { ...task.toObject(), date: null, time: null, day: null };
            }
            const formattedTime = formatTime(task.dueDate);
            const dueDate = new Date(date);
            const isCurrentWeek = isWithinCurrentWeek(dueDate);
            const day = isCurrentWeek ? dueDate.toLocaleDateString(undefined, { weekday: 'long' }) : null;
            return { ...task.toObject(), date: isCurrentWeek ? day : date, time: formattedTime, day: isCurrentWeek ? null : day };
        });

        const tasksCompleted= await Task.countDocuments({completed:true, user_id:user_id});
        // console.log(tasks)
        const targetDate = new Date();
        const startOfTargetDate = new Date(targetDate);
        startOfTargetDate.setHours(0, 0, 0, 0);  // Set the time to the beginning of the day
        const endOfTargetDate = new Date(targetDate);
        endOfTargetDate.setHours(23, 59, 59, 999);  // Set the time to the end of the day
        const startOfTargetWeek=new Date('2023-11-20');
        startOfTargetWeek.setHours(0,0,0,0);
        const endOfTargetWeek=new Date('2023-11-26');
        endOfTargetWeek.setHours(23,59,59,999);
        const weeklyCount = await Task.aggregate([
            {
              $match: {
                completed: true,
                taskCompleted: {
                  $gte: startOfTargetWeek,
                  $lt: endOfTargetWeek,
                },
              },
            },
            {
              $addFields: {
                dayOfWeek: { $dayOfWeek: { date: '$taskCompleted', timezone: 'Asia/Kolkata' } }, // Adjust timezone to 'Asia/Kolkata' for India
              },
            },
            {
              $match: {
                dayOfWeek: { $gte: 2 }, // Considering Monday as the start of the week
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ]);
          
        const count=await Task.aggregate([
            {
              $match: {
                completed: true,
                taskCompleted: {
                  $gte: startOfTargetDate,
                  $lt: endOfTargetDate
                }
              }
            },
            {
              $group: {
                _id: null,  // Group all results into a single group
                count: { $sum: 1 }  // Count the number of documents in the group
              }
            }]);
            // console.log(typeof(count))
            let daily;
            if (Array.isArray(count) && count.length > 0) {
                console.log(count);
                console.log(count[0].count);
                daily = count[0].count;
            } else {
                daily = 0;
            }
            let weekly;

                if (Array.isArray(weeklyCount) && weeklyCount.length > 0) {
                console.log(weeklyCount);
                console.log(weeklyCount[0].count);
                weekly = weeklyCount[0].count;
            } else {
                weekly = 0;
            }

        const response={
            recurTasks:processedRecurTasks,
            tasks:processedTasks, 
            daily:daily,
            weekly:weekly,
            tasksCompleted:tasksCompleted,
            dailyGoal:userGoals.dailyGoal,
            weeklyGoal:userGoals.weeklyGoal,
        }
        console.log(response)
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving tasks' });
    }
}

const createTask=async (req, res) => {
    // console.log("called ", req.body);
      try {
          const { title, description,dueDate,add, priority, completed  } = req.body;
          const user_id=req.user._id;
        //   console.log("bakend", user_id,add);
          const task = new Task({ title, description, dueDate,recurringTask:add, priority, completed, user_id});
          const savedTask = await task.save();

        //   console.log("bakend", user_id);
        //   console.log(task);
          res.status(200).json(savedTask);
      } catch (error) {
        // console.log("fronrend")
          console.error(error);
          res.status(500).json({ error: 'Error creating a task' });
      }
  }

  const updateTask=async (req, res) => {
    try {
        const { title, description,dueDate,recurringTask, priority, completed} = req.body;
        const user_id=req.user._id;
        // console.log(recurringTask)
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title, description,dueDate,recurringTask, priority, completed
            },
            { new: true }
        );
        res.json(updateTask);
    } catch (error) {
        res.status(500).json({ error: 'Error updating a task' });
    }
}

const deleteTask= async (req, res) => {
    try {
        const currDate=new Date();
        // console.log
        const task=await Task.findOne({_id:req.params.id});
        if(task.recurringTask===true){
            const currDate=new Date();
            const setDue=new Date(task.dueDate);
            const nextDate=currDate.getDate()+1;
            setDue.setDate(nextDate);
            await Task.findByIdAndUpdate({_id:req.params.id},{$set:{dueDate:setDue}})
        }
        await Task.findByIdAndUpdate({_id:req.params.id},{$set:{completed:true, taskCompleted:currDate}});
        const sub=await Task.findOne({_id:req.params.id})
        // console.log("sub", sub)
        const completedTime=new Date(sub.taskCompleted);
        // console.log(completedTime.getHours(), completedTime.getMinutes())
        res.status(200).json({message:"Successfuully deleted task", task:task});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting a task' });
    }
}

const undoTask=async(req, res)=>{
    const { _id}=req.body.undo;
    // console.log("Undo tasks are",_id)
    // console.log(req.body)
    try {
        const response=await Task.findByIdAndUpdate({_id},{$set:{completed:false}})
        res.status(200).json({response});
    } catch (error) {
        res.status(400).json({error});
    }
}
export {getAllTasks, createTask, updateTask, deleteTask,undoTask};