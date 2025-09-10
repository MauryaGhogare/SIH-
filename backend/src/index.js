// server.js
import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.Route.js";
import chatRoutes from "./routes/chat.route.js";
// import reviewRoutes from "./routes/review.route.js";
import sensorRoutes from "./routes/sensor.Route.js";
import loansRoutes from "./routes/loans.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Middleware - configure all in one place
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// API Routes - consolidate all routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
// app.use("/api/review", reviewRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/loans", loansRoutes);

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", { ...message, text: message.msg });
  });  
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server function
const startServer = async () => {
  try {
    await connectDb();
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
};

// Start the server
startServer();