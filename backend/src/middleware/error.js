const { ZodError } = require("zod");

function errorHandler(err, _req, res, _next) {
  // eslint-disable-line no-unused-vars
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { message: "Validation failed", details: err.flatten().fieldErrors },
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: { message: err.message } });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: { message: "Duplicate value", details: err.keyValue } });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: { message: `Invalid ${err.path}: ${err.value}` } });
  }

  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message || "Internal server error" } });
}

module.exports = errorHandler;
