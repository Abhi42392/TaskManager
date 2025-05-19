import mongoose from 'mongoose'

const leadsSchema=new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true},
    date:{type:Date,default:Date.now},
    agent:{type:mongoose.Schema.Types.ObjectId,ref:'agent',default:'null'},
    notes:{type:String,default:""},
},{ timestamps: true })

const leadsModel=mongoose.models.leads||mongoose.model("leads",leadsSchema)
export default leadsModel;