const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { createTodoSchema, updateOrDeleteTodoSchema } = require("./types");

// global constants
const app = express();
const PORT = process.env.PORT || 3000;
const successResponseMsg = "Request completed successfully.";
const failureResponseMsg = "Could not complete response.";
const internalServerMsg = "Something wrong with our servers.";

// middlewares
app.use(express.json());

// routes
app.get("/todos", (req, res, next) => {
  try {
    if (!res.headersSent)
      return res.status(StatusCodes.OK).json({
        error: false,
        data: { todos: [], message: successResponseMsg },
      });
  } catch (error) {
    next(error);
  }
});

app.get("/todos/:id", (req, res, next) => {
  try {
    if (!res.headersSent)
      return res.status(StatusCodes.OK).json({
        error: false,
        data: { todo: {}, message: successResponseMsg },
      });
  } catch (error) {
    next(error);
  }
});

app.post("/todos", (req, res, next) => {
  try {
    const todoData = createTodoSchema.safeParse(req.body);

    if (!todoData.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: todoData?.error,
            message: failureResponseMsg,
          },
        });
    }

    if (!res.headersSent)
      return res
        .status(StatusCodes.CREATED)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error?.message);
  }
});

app.patch("/todos", (req, res, next) => {
  try {
    const todoData = updateOrDeleteTodoSchema.safeParse(req.body);

    if (!todoData.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: todoData?.error,
            message: failureResponseMsg,
          },
        });
    }

    if (!res.headersSent)
      return res
        .status(StatusCodes.OK)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error);
  }
});

app.delete("/todos", (req, res, next) => {
  try {
    const todoData = updateOrDeleteTodoSchema.safeParse(req.body);

    if (!todoData.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: todoData?.error,
            message: failureResponseMsg,
          },
        });
    }

    if (!res.headersSent)
      return res
        .status(StatusCodes.OK)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error);
  }
});

// global error handler
app.use((err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: true, data: { error: err, message: internalServerMsg } });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
