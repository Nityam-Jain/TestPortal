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
const resultRoutes = require("./Routes/resultRoutes");
const bannerRoutes = require("./Routes/bannerRoutes")
const contactRoutes = require("./Routes/contactRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const subscriptionRoutes = require("./Routes/subscriptionRoutes");



const dotenv = require("dotenv");
dotenv.config();
const app = express();
const bodyParser = require("body-parser");
//reel---------
// const reelRoutes = require("./Routes/reelRoutes");

const path = require("path");


const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,
}));

// //reels--------------
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/reels", reelRoutes);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
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
app.use("/api/results", resultRoutes);
app.use("/api/admin/banners", bannerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/subscriptions", subscriptionRoutes);




// DB + Server Init
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
