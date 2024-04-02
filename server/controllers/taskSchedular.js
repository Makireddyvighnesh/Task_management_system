import { sendNotifiaction } from "./notificationController.js";
import cron from 'node-cron';
import Task from "../models/task.js";

cron.schedule('0 0 * * *', async () => {
    try {
        const tasks=await Task.find({
            dueDate: {
                $gte: new Date(),
                $lt: new Date(new Date().setDate(new Date().getDate() + 1)),
              },
        });

        for(const task of tasks){
            await sendNotifiaction('vighneshmakireddy@gmail.com', taskTitle);
        }
        console.log('Taskdue date remainders sent');
    } catch (error) {
        console.log(error);
    }
});