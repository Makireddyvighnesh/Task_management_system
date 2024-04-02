import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    unique:true,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required:true
  },
  avatar:{
    type:String
  },
  weeklyGoal:{
    type:Number,
    default:30,
  },
  dailyGoal:{
    type:Number,
    default:5,
  },
  date:{
    type:Date,
    default:Date.now
  },
  groupName:String,
});

//static signup method
userSchema.statics.signup=async(userName,email, password)=>{
  //validation
  if(!email || !password){
    throw Error("All fields must be filled");
  }
  if(!validator.isEmail(email)){
    throw Error("Not a valid email");
  }
  if(!validator.isStrongPassword(password)){
    throw Error("The password is not strong enough. Use characters, symbols tooo");
  }
  const exists= await User.findOne({email})
  if(exists){
    throw Error('Email already in use')
  }

  const existUserName=await User.findOne({userName});
  if(existUserName){
    throw Error('UserName should be unique. Add some special characters ate end.');
  }

  const salt=await bcrypt.genSalt(10);
  const hash=await bcrypt.hash(password, salt);

  const user=await User.create({userName,email, password:hash});
  console.log(user)
  return user;

}

//static login user
userSchema.statics.login=async(email, password)=>{
  if(!email || !password){
    throw Error("All fields must be filled");
  }
  console.log(email, password)
  const user=await User.findOne({email:email});
  console.log(user)
  if(!user){
    throw Error('Incorrect email');
  }
  const match =await bcrypt.compare(password, user.password);
  if(!match){
    throw Error("Incorrect password");
  }
  console.log("last")
  return user;
}

const User=new mongoose.model('User', userSchema);
export default User;
