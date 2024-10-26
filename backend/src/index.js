const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { createTodoSchema, updateOrDeleteTodoSchema } = require("./types");
const { TodoModel } = require("./db");
require("dotenv").config();

// global constants
const app = express();
const PORT = process.env.PORT || 8000;
const successResponseMsg = "Request completed successfully.";
const failureResponseMsg = "Could not complete response.";
const internalServerMsg = "Something wrong with our servers.";

// middlewares
app.use(express.json());

// routes
app.get("/todos", async (req, res, next) => {
  try {
    const todos = await TodoModel.find({});

    await Promise.all(
      todos?.map(async (todo) => {
        todo.todoId = todo._id;
        delete todo._id;
        delete todo.__v;
      })
    );

    if (!res.headersSent)
      return res.status(StatusCodes.OK).json({
        error: false,
        data: { todos },
        message: successResponseMsg,
      });
  } catch (error) {
    next(error?.message);
  }
});

app.get("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await TodoModel.findOne({ _id: id });

    if (!todo) {
      if (!res.headersSent)
        return res.status(StatusCodes.NOT_FOUND).json({
          error: false,
          data: {
            error: "Todo with the given id does not exist",
            message: failureResponseMsg,
          },
        });
    }

    todo.id = todo._id;
    delete todo._id;

    if (!res.headersSent)
      return res.status(StatusCodes.OK).json({
        error: false,
        data: { todo },
        message: successResponseMsg,
      });
  } catch (error) {
    next(error?.message);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const createPayload = createTodoSchema.safeParse(req.body);

    if (!createPayload.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: createPayload?.error,
            message: failureResponseMsg,
          },
        });
    }

    // Check if todo with given title already exists or not
    const doesTodoExist = await TodoModel.findOne({
      title: createPayload.data.title,
    });

    console.log(doesTodoExist);

    if (doesTodoExist) {
      if (!res.headersSent)
        return res.status(StatusCodes.CONFLICT).json({
          error: false,
          data: {
            error: "Todo with the given title already exists",
            message: failureResponseMsg,
          },
        });
    }

    // Push it to db
    const todo = new TodoModel({ ...createPayload.data, completed: false });
    await todo.save();

    if (!res.headersSent)
      return res
        .status(StatusCodes.CREATED)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error?.message);
  }
});

app.patch("/todos", async (req, res, next) => {
  try {
    const updatePayload = updateOrDeleteTodoSchema.safeParse(req.body);

    if (!updatePayload.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: updatePayload?.error,
            message: failureResponseMsg,
          },
        });
    }

    // Check if todo with given title exists or not
    const doesTodoExist = await TodoModel.findOne({
      _id: updatePayload.data.id,
    });

    if (!doesTodoExist) {
      if (!res.headersSent)
        return res.status(StatusCodes.NOT_FOUND).json({
          error: false,
          data: {
            error: "Todo with the given id does not exist",
            message: failureResponseMsg,
          },
        });
    }

    // Update it in db
    await TodoModel.updateOne(
      { _id: updatePayload.data.id },
      { completed: true }
    );

    if (!res.headersSent)
      return res
        .status(StatusCodes.OK)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error?.message);
  }
});

app.delete("/todos", async (req, res, next) => {
  try {
    const deletePayload = updateOrDeleteTodoSchema.safeParse(req.body);

    if (!deletePayload.success) {
      if (!res.headersSent)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          error: false,
          data: {
            error: deletePayload?.error,
            message: failureResponseMsg,
          },
        });
    }

    // Check if todo with given title exists or not
    const doesTodoExist = await TodoModel.findOne({
      _id: deletePayload.data.id,
    });

    if (!doesTodoExist) {
      if (!res.headersSent)
        return res.status(StatusCodes.NOT_FOUND).json({
          error: false,
          data: {
            error: "Todo with the given id does not exist",
            message: failureResponseMsg,
          },
        });
    }

    // delete it from db
    await TodoModel.deleteOne({ _id: deletePayload.data.id });

    if (!res.headersSent)
      return res
        .status(StatusCodes.OK)
        .json({ error: false, data: { message: successResponseMsg } });
  } catch (error) {
    next(error?.message);
  }
});

// global error handler
app.use((err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: true, data: { error: err, message: internalServerMsg } });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
