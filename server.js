require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDb = require("./src/config/database");

// Import all routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const problemRoutes = require("./src/routes/problemRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const contentRoutes = require("./src/routes/contentRoutes");
const collegeRoutes = require("./src/routes/collegeRoutes");
const courseVideoRoutes = require("./src/routes/courseVideoRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const submissionRoutes = require("./src/routes/submissionRoutes");
const skillsRoutes = require("./src/routes/skillsRoutes");

// Other existing routes
const runCodeRoutes = require("./src/routes/runCode");
const cleanupTemp = require("./src/utils/cleanupTemp");

cleanupTemp(); // run cleanup on startup

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

app.use("/uploads", express.static("uploads"));

// Mount all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/course-videos", courseVideoRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/skills", skillsRoutes);

app.use("/api/run-code", runCodeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong on the server'
    });
});

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