import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import companyRoute from "./routes/companyRoutes.js"
import resumeRoutes from "./routes/resumeRoutes.js"
import tnpdataRoutes from './routes/tnpdata.routes.js';
import buildResume from "./routes/buildResume.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/Contactroutes.js";
import confidenceRoutes from "./routes/confidenceRoutes.js";

dotenv.config();

const app = express();

// ✅ ONLY THIS CHANGED
app.use(cors({
  origin: "https://skillbridge-mocha-five.vercel.app",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

await connectDB();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/company", companyRoute);
app.use("/api", resumeRoutes);
app.use('/api/tnpdata', tnpdataRoutes);
app.use("/api/resume", buildResume);
app.use("/api/interview", interviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/confidence", confidenceRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log("Server is running on PORT: " + PORT)
  );
}

export default app;