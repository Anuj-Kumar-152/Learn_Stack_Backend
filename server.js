require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDb = require("./src/config/database.js");
const topicRoutes = require("./src/routes/topicRoutes.js");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 9000;

/* ---------------- Middleware ---------------- */

app.use(
   cors({
      origin: [
         "http://localhost:5173", // frontend dev 
         process.env.FRONTEND_URL // production frontend
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
   })
);

app.use(express.json());

/* ---------------- Routes ---------------- */

app.get("/", (req, res) => {
   res.send("🚀 Learn Stack API is running");
});

app.use("/api", topicRoutes);

/* ---------------- Database + Server ---------------- */

connectDb()
   .then(() => {

      console.log("\n✅ Database connected successfully");

      server.listen(PORT, () => {
         console.log(`🚀 Server running on port ${PORT}`);
      });

   })
   .catch((err) => {
      console.error("❌ Database connection failed:", err);
   });