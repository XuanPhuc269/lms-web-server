import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.post("/clerk", express.json(), clerkWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

