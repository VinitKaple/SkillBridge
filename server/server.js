import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import companyRoute from "./routes/companyRoutes.js"
import resumeRoutes from "./routes/resumeRoutes.js"
import companyRoutes from './routes/company.routes.js';




dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

await connectDB();

app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.use("/api/company",companyRoute)
app.use("/api",resumeRoutes)
app.use('/api/companies', companyRoutes);

// Register route

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log("Server is running on PORT: " + PORT)
  );
}

export default app;
