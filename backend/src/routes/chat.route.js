import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMsg, sendMsg } from "../controllers/chat.controller.js";

const router = express.Router();
router.get("/getMessages",protectRoute,getMsg);
router.post("/sendMessage",protectRoute,sendMsg);

export default router;