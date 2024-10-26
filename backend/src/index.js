const express = require("express");
const { StatusCodes } = require("http-status-codes");

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
    res
      .status(StatusCodes.OK)
      .json({ error: false, data: { todos: [], message: successResponseMsg } });
  } catch (error) {
    next(error);
  }
});

app.get("/todos/:id");

app.post("/todos");

app.put("/todos");

app.delete("/todos");

// global error handler
app.use((err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: true, data: { message: internalServerMsg } });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
