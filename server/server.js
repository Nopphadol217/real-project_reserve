const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();
require("dotenv/config");
const { readdirSync } = require("fs");
const handleError = require("./middleware/handleError");

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// ใช้ CORS
app.use(
  cors({
    origin: "http://deme-hotel.nkstec.ac.th", // frontend ของคุณ (React Dev Server)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ถ้าคุณใช้ cookies หรือ session
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

const port = process.env.PORT || 5000;

app.use(handleError);
app.listen(port, () => {
  console.log(`Server is Running on PORT ${port}`);
});
