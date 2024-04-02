import Custom from "../models/customSection.js";

const getAllSections=async(req, res)=>{
    const email=req.params.email;
    console.log(email)
    try {
        const response=await Custom.find({userEmail:email});
        console.log("response",response)
        res.status(200).json(response);
    } catch (error) {
        res.json(400).json(error);
    }
}

const createSection=async(req, res)=>{
    const {email, name}=req.body;
    console.log(req.body)
    try {
        const response=await new Custom({name:name,userEmail:email });
        await response.save()
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error)
    }
}

// const getAllTasks=async(req, res)=>{
//     const email=req.params.email;
//     try {
//         const response=await 
//     } catch (error) {
        
//     }
// }

const addTask=async(req, res)=>{
    const {email,section,task}=req.body;
    console.log(section)
    console.log("called addTadk")
  
    console.log(email,task, section);
    console.log(req.body);
    try {
        const response=await Custom.findOne({userEmail:email, name:section})
        console.log(response);

        const resp=await Custom.findOneAndUpdate({userEmail:email, name:section}, {$push:{tasks:task}});
        console.log(resp);
        res.status(200).json({resp})
    } catch (error) {
        res.status(400).json(error)
    }
}

const deleteSection=async(req, res)=>{
    const {email, title}=req.params;
    console.log(req.params)
    try {
        const response=await Custom.deleteOne({userEmail:email, name:title});
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}

const deleteTask = async (req, res) => {
    const { section, email, title } = req.params; // Destructure section, email, and title
    console.log(req.params);
    console.log(section)
    console.log("delete Task");
  
    try {
      const response = await Custom.updateOne(
        { name: section, userEmail: email, 'tasks.title': title },
        { $pull: { tasks: { title: title } } }
      );
  
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };
  
export  {createSection, addTask, getAllSections, deleteTask, deleteSection};