const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const AdminRouter = require("./Routes/AdminRouter")
const questionRoutes = require("./Routes/questionRoutes");
const testRoutes = require("./Routes/testRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const subjectRoutes = require("./Routes/subjectRoutes");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const bodyParser = require("body-parser");
//reel---------
const reelRoutes = require("./Routes/reelRoutes");

const path = require("path");


const PORT = process.env.PORT || 5000;

//reels--------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/reels", reelRoutes);


// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/admin', AdminRouter);
// app.use('/uploads', express.static('uploads'));
app.use('/api/tests', testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/categories", categoryRoutes);

 app.use(cors({  
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
}));

// DB + Server Init
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
