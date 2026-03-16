import express from "express";
import { handleContactForm } from "../controllers/Contactcontroller.js";

const router = express.Router();

// POST /api/contact/send
router.post("/send", handleContactForm);

export default router;