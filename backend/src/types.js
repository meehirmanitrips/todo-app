const { z } = require("zod");

const createTodoSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(3).max(50),
  description: z
    .string({ required_error: "Description is required" })
    .min(10)
    .max(300),
});

const updateOrDeleteTodoSchema = z.object({
  id: z.string({ required_error: "Id is required" }),
});

module.exports = { createTodoSchema, updateOrDeleteTodoSchema };
