import {createSection, addTask, deleteSection, getAllSections, deleteTask} from "../controllers/customController.js";
import express from 'express';

const customRouter=express.Router();

customRouter.get('/',async(req, res)=>{
    res.send(" Hello world");
})

customRouter.get('/:email', getAllSections);
customRouter.post('/section', createSection);
customRouter.post('/task', addTask);
customRouter.delete('/:title/:email/:section',deleteTask)
customRouter.delete('/:email/:title', deleteSection);


export default customRouter;