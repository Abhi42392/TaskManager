import validator from 'validator'       
import jwt from 'jsonwebtoken'          
import adminModel from '../models/adminModel.js'    
import bcrypt from 'bcrypt'             
import agentModel from '../models/agentModel.js'   
import * as XLSX from 'xlsx';             
import fs from 'fs';                      
import leadsModel from '../models/leadsModel.js'   

// Function to create JWT token for a given user/admin ID
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Register a new admin user
const register = async (req, res) => {
    const { password, email } = req.body;

    try {
        // Check if email and password are provided
        if (!password || !email) {
            return res.json({ success: false, message: "Credentials missing" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter valid email" });
        }

        // Password minimum length check
        if (password.length < 8) {
            return res.json({ success: false, message: "Password is too small" });
        }

        // Check if admin with this email already exists
        const admin = await adminModel.findOne({ email });
        if (admin) {
            return res.json({ success: false, message: "Account already exist, try login" });
        }

        // Generate salt and hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin document and save to DB
        const newadmin = await adminModel({ email, password: hashedPassword });
        await newadmin.save();

        // Create JWT token for the new admin
        const token = createToken(newadmin._id);

        // Send success response with token
        return res.json({ success: true, token });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
}

// Login existing admin
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.json({ success: false, message: "Account doesn't exist, try register" });
        }

        // Compare entered password with hashed password in DB
        const compare = await bcrypt.compare(password, admin.password);
        if (!compare) {
            return res.json({ success: false, message: "Incorrect Password" });
        }

        // Create JWT token for the admin
        const token = createToken(admin._id);

        // Send success response with token
        return res.json({ success: true, token });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

// Add a new agent user
const addAgent = async (req, res) => {
    const { name, countryCode, phone, email, password } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !countryCode || !phone || !email || !password) {
            return res.json({ success: false, message: "Credentials missing" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter valid email" });
        }

        // Password minimum length check
        if (password.length < 8) {
            return res.json({ success: false, message: "Password is too small" });
        }

        // Check if agent with this email already exists
        const agent = await agentModel.findOne({ email });
        if (agent) {
            return res.json({ success: false, message: "Account already exist, try login" });
        }

        // Generate salt and hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new agent document and save to DB
        const newagent = await agentModel({ email, password: hashedPassword, name, phone, countryCode });
        await newagent.save();

        console.log(newagent);  // For debugging purposes

        // Send success response
        return res.json({ success: true, message: "Agent created" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

// Upload Excel file, parse and distribute leads evenly among agents
const uploadFile = async (req, res) => {
    try {
        // Parse uploaded file into JSON array of leads
        const jsonData = parseFile(req.file.path);

        // Array to hold leads distributed per agent
        const distributed = [];

        // Get all agents from DB
        const agents = await agentModel.find({});

        // Initialize distributed array with agent IDs and empty leads array
        agents.map((agent) => {
            distributed.push({ agentId: agent._id, leads: [] });
        });

        let index = 0;
        let length = distributed.length;

        // Distribute leads in a round-robin fashion among agents
        jsonData.map((lead) => {
            distributed[index].leads.push(lead);
            index = (index + 1) % length;
        });

        // Save each lead associated with respective agent in the DB
        distributed.map((item) => {
            item.leads.map(async (lead) => {
                const newLead = await leadsModel({
                    phone: lead.Phone,
                    name: lead.Name,
                    notes: lead.Notes,
                    agent: item.agentId
                });
                await newLead.save();
            });
        });

        // Send success response after processing
        return res.json({ success: true });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
}

// Get all leads with agent details populated
const getAllLeads = async (req, res) => {
    try {
        // Fetch all leads from DB, populate 'agent' field, sort newest first
        const leads = await leadsModel
            .find({})
            .populate('agent')
            .sort({ createdAt: -1 });

        // Send success response with leads data
        res.json({ success: true, leads });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.json({ success: false, message: 'Server error' });
    }
}

// Helper function to parse XLSX file and convert to JSON
const parseFile = (filePath) => {
    // Read file buffer from disk
    const fileBuffer = fs.readFileSync(filePath);

    // Parse workbook from buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Get first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get worksheet data for the sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert worksheet to JSON array of objects
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Delete the uploaded file after parsing to save disk space
    fs.unlinkSync(filePath);

    return jsonData;
}

export { register, login, addAgent, uploadFile, getAllLeads }
