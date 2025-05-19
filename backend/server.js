// Import necessary modules
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongoDB.js' // Function to connect to MongoDB
import 'dotenv/config' // Loads environment variables from a .env file
import adminRouter from './router/adminRouter.js' // Admin routes

// Connect to the database
connectDB()

// Use PORT from environment or fallback to 4000
const PORT = process.env.PORT || 4000

// Initialize express app
const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Enable CORS for all origins
app.use(cors())

// Use /api/admin for all admin-related routes
app.use("/api/admin", adminRouter)

// Basic health check route
app.get("/", (req, res) => {
    res.send("Api is running")
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
