const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@practice.kdt5a.mongodb.net/todo_app?retryWrites=true&w=majority&appName=Practice`
    );

    console.log("Mongodb connected");
  } catch (error) {
    console.error(error?.message);
  }
})();

const schema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const TodoModel = mongoose.model("Todo", schema);

module.exports = { TodoModel };
