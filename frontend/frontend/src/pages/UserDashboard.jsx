import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks", {
      headers: { Authorization: token },
    });
    setTasks(res.data || []);
  };

  const createTask = async () => {
    await API.post(
      "/tasks",
      { title, description }, 
      { headers: { Authorization: token } }
    );

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const updateTask = async (task) => {
    await API.put(
      `/tasks/${task.id}`,
      { ...task, status: "completed" },
      { headers: { Authorization: token } }
    );
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`, {
      headers: { Authorization: token },
    });
    fetchTasks();
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditStatus(task.status);
  };

  const saveEdit = async () => {
    await API.put(
      `/tasks/${editTask.id}`,
      {
        title: editTitle,
        description: editDesc,
        status: editStatus,
      },
      { headers: { Authorization: token } }
    );

    setEditTask(null);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">
            User Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <h2 className="font-semibold mb-4 text-gray-600">
            Create Task
          </h2>

          <div className="flex flex-wrap gap-3">
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={createTask} className="btn-primary">
              + Add Task
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <div className="bg-white p-5 rounded-xl shadow-sm">

              <p className="font-semibold text-gray-700">{t.title}</p>
              <p className="text-sm text-gray-500">{t.description}</p>

              <span
                className={`badge ${
                  t.status === "completed"
                    ? "badge-green"
                    : "badge-yellow"
                }`}
              >
                {t.status}
              </span>

              <div className="flex gap-2 mt-3">
                <button
                  disabled={t.status === "completed"}
                  onClick={() => updateTask(t)}
                  className="btn-blue disabled:opacity-40"
                >
                  Complete
                </button>

                <button
                  onClick={() => openEditModal(t)}
                  className="btn-yellow"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <h2 className="font-semibold mb-3">Edit Task</h2>

              <input
                className="input mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                className="input mb-2"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />

              <select
                className="input mb-3"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn-primary w-full">
                  Save
                </button>
                <button
                  onClick={() => setEditTask(null)}
                  className="btn-danger w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;