const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const errorHandler = require("./middleware/error");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (_req, res) =>
  res.json({ name: "CampusConnect API", status: "ok", version: "1.0.0" })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CampusConnect API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

app.use((req, res) => res.status(404).json({ error: { message: "Not found" } }));
app.use(errorHandler);

module.exports = app;
