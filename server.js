require("dotenv").config();

const express = require("express");
const http = require("http");

const connectDb = require("./src/config/database.js");

const app = express();
const server = http.createServer(app);
const cors = require("cors");

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.get("/", (req, res) => {
   res.send("API is running 🚀");
});


const topicRoutes = require("./src/routes/topicRoutes.js");

app.use("/api", topicRoutes);




connectDb()
   .then(() => {
      console.log("\n✅ Database connected successfully....");

      server.listen(PORT, () => {
         console.log(`🚀 Server running on port ${PORT}`)
      });
   })
   .catch((err) => {
      console.error("❌ Database connection failed:", err);
   });