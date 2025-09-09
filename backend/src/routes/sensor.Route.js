import express from "express";
import { getCommand, getData, postCommand, postData } from "../controllers/sensor.controller.js";

const router=express.Router();

router.get("/data",getData);
router.post("/data",postData);
router.get("/command",getCommand);
router.post("/command",postCommand);

export default router;