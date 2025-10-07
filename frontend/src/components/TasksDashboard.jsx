import { useState, useEffect } from "react";
import axios from "axios";

function TasksDashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/taskslist", { withCredentials: true });
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/taskslist", form, { withCredentials: true });
      setForm({ title: "", description: "" });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id) => {
    const title = prompt("New title:");
    const description = prompt("New description:");
    if (!title || !description) return;
    try {
      await axios.put(`http://localhost:3000/api/taskslist/${id}`, { title, description }, { withCredentials: true });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/taskslist/${id}`, { withCredentials: true });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Tasks Dashboard</h2>

        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Add Task
          </button>
        </form>

        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-bold text-gray-800">{task.title}</p>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(task._id)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TasksDashboard;
