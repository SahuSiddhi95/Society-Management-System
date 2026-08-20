// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();
connectDB();
const PORT = process.env.PORT;
const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500000,
  })
);
// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/adminNotic", require("./routes/noticeRoutes"));
app.use("/api", require("./routes/contactRoutes"));
app.use("/api/payment", require("./routes/transactionRoutes"))
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));
app.use("/api/society", require("./routes/societyRoutes"));

// Initialize Cron Jobs
require("./cron/reminders");

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));