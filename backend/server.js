import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import adRoutes from "./routes/adRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.error("MongoDB connection error:", err));
