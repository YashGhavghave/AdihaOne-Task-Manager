import express, { urlencoded } from "express";
import { DB_Connection } from "./connection/datamodel.connection.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

import RegisterRoute from "./routes/register.routes.js";
import LoginRoute from "./routes/login.routes.js";
import TaskRoute from "./routes/taskslist.routes.js";
import TaskListRoute from "./routes/taskslist.routes.js";
import logoutRoute from "./routes/logout.routes.js";

const app = express();
const port = 3000;

// --- Body parsers ---
app.use(urlencoded({ extended: true }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// --- Security Headers ---
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

// --- CORS ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// --- Rate Limiting ---
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later.",
  })
);

// --- HPP (HTTP Parameter Pollution) ---
app.use(hpp());

// --- Manual, safe sanitizer (body only) ---
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) delete obj[key];
    else if (typeof obj[key] === "object") sanitizeObject(obj[key]);
  }
};

app.use((req, res, next) => {
  sanitizeObject(req.body); // only sanitize body, not query or params
  next();
});

// --- Database Connection ---
(async () => {
  try {
    await DB_Connection();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error);
    process.exit(1);
  }
})();

// --- Routes ---
app.use("/", RegisterRoute);
app.use("/", LoginRoute);
app.use("/", TaskRoute);
app.use("/", TaskListRoute);
app.use("/", logoutRoute);

// --- Default route ---
app.get("/", (req, res) => {
  res.send("Welcome Onichan! Task Manager Backend is running.");
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
