require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDb = require("./src/config/database.js");
const topicRoutes = require("./src/routes/topicRoutes.js");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 9000; 
const allowedOrigins = [
   "http://localhost:5173",
   "https://learn-stack-frontend-lilac.vercel.app"
];

app.use(
   cors({
      origin: function (origin, callback) { 
         if (!origin) return callback(null, true);

         if (allowedOrigins.includes(origin)) {
            return callback(null, true);
         } else {
            return callback(new Error("CORS not allowed"));
         }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
   })
);

app.use(express.json());
 

app.get("/", (req, res) => {
   res.send("Learn Stack API is running");
});

app.use("/api", topicRoutes); 

connectDb()
   .then(() => {

      console.log("Database connected successfully");

      server.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });

   })
   .catch((err) => {
      console.error("Database connection failed:", err);
   });