import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const initialFormState = { title: "", description: "" };

const url = "http://localhost:3000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  async function addTodo(title, description) {
    try {
      await axios.post(url, {
        title,
        description,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getTodos() {
    try {
      const response = await axios.get(url);
      const todosData = response.data.data.todos;

      if (Array.isArray(todosData)) {
        setTodos(todosData);
      } else {
        console.error(
          "Expected todos to be an array but got:",
          typeof todosData
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateTodo(id) {
    try {
      await axios.patch(url, { id });
      await getTodos();
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    await addTodo(formData.title, formData.description);
    setFormData(initialFormState);
    await getTodos();
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(url, { data: { id } });
      await getTodos();
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    async function loadTodos() {
      await getTodos();
    }

    loadTodos();
  }, []);

  return (
    <>
      <div className="card">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
          ></input>
          <input
            type="text"
            placeholder="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          ></input>
          <button type="submit">Add Todo</button>
        </form>
      </div>
      <div className="card">
        {todos?.map((todo, index) => {
          return (
            <div key={index}>
              <h2>{todo.title}</h2>
              <h6>{todo.description}</h6>
              <button
                onClick={() => {
                  updateTodo(todo.todoId);
                }}
              >
                {todo.completed ? "Done!!!" : "Mark as completed"}
              </button>
              <button
                onClick={() => {
                  deleteTodo(todo.todoId);
                }}
              >
                DELETE
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
