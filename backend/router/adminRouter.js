import express from 'express'
import { addAgent, getAllLeads, login, register,uploadFile} from '../controller/adminController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';
const adminRouter=express.Router();

adminRouter.post("/login",login)
adminRouter.post("/register",register)
adminRouter.post("/add-agent",authUser,addAgent)
adminRouter.post("/upload-file",authUser,upload.single('file'),uploadFile)
adminRouter.post("/get-all-leads",authUser,getAllLeads)
export default adminRouter
