import mongoose from 'mongoose'


const agentSchema=new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    countryCode:{type:String,required:true}
})

const agentModel=mongoose.models.agent||mongoose.model("agent",agentSchema)
export default agentModel;