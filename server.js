import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to Database
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.post("/clerk", express.json(), clerkWebhooks);
app.use('/api/educator', express.json(), educatorRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

