import express from "express";
import { chcekAuth, login, logout, signup, update } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/update",protectRoute,update);

router.get("/check",protectRoute,chcekAuth);

export default router;