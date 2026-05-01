const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const itemSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(1000),
  type: z.enum(["lost", "found"]),
  category: z.string().trim().max(50).optional(),
  location: z.string().trim().max(120).optional(),
});

const groupSchema = z.object({
  moduleCode: z.string().trim().min(2).max(20),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional(),
  schedule: z.string().trim().max(200).optional(),
  capacity: z.coerce.number().int().min(2).max(100).optional(),
});

const tutorSchema = z.object({
  moduleCode: z.string().trim().min(2).max(20),
  type: z.enum(["offer", "request"]),
  hourlyRate: z.coerce.number().min(0).optional(),
  availability: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
});

const roleUpdateSchema = z.object({
  role: z.enum(["student", "admin"]),
});

module.exports = {
  registerSchema,
  loginSchema,
  itemSchema,
  groupSchema,
  tutorSchema,
  roleUpdateSchema,
};
