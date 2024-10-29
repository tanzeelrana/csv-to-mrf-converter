import express from "express";
import cors from "cors";
import  json  from "body-parser";
import fileRoutes from './src/routes/fileRoutes.js'
import dotenv from 'dotenv';
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", fileRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
