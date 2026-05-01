
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/users", {
      headers: { Authorization: token },
    });
    setUsers(res.data.filter((u) => u.role !== "admin"));
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks", {
      headers: { Authorization: token },
    });
    setTasks(res.data);
  };

  const createUser = async () => {
    await API.post(
      "/auth/register",
      { name, email, password, role: "user" },
      { headers: { Authorization: token } }
    );
    setName("");
    setEmail("");
    setPassword("");
    fetchUsers();
  };

  const createTask = async () => {
    await API.post(
      "/tasks",
      { title, description, user_id: selectedUser },
      { headers: { Authorization: token } }
    );
    setTitle("");
    setDescription("");
    setSelectedUser("");
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

  const deleteUser = async (id) => {
    await API.delete(`/users/${id}`, {
      headers: { Authorization: token },
    });
    fetchUsers();
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
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <h2 className="font-semibold mb-4 text-gray-600">Create User</h2>

          <div className="flex flex-wrap gap-3">
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={createUser} className="btn-primary">
              + Add User
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
          <h2 className="font-semibold mb-4 text-gray-600">Create Task</h2>

          <div className="flex flex-wrap gap-3">
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <select className="input" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>

            <button onClick={createTask} className="btn-primary">
              + Create Task
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => {
            const userTasks = tasks.filter((t) => t.user_id === u.id);

            return (
              <div className="bg-white p-5 rounded-xl shadow-sm">

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-700">{u.name}</h3>
                  <button onClick={() => deleteUser(u.id)} className="btn-danger">
                    Delete
                  </button>
                </div>

                <p className="text-sm text-gray-400 mb-3">{u.email}</p>

                {userTasks.map((t) => (
                  <div className="border rounded-lg p-3 mb-3 bg-gray-50">

                    <p className="font-semibold">{t.title}</p>
                    <p className="text-sm text-gray-500">{t.description}</p>

                    <span className={`badge ${
                      t.status === "completed" ? "badge-green" : "badge-yellow"
                    }`}>
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

                      <button onClick={() => openEditModal(t)} className="btn-yellow">
                        Edit
                      </button>

                      <button onClick={() => deleteTask(t.id)} className="btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {editTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <h2 className="font-semibold mb-3">Edit Task</h2>

              <input className="input mb-2" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input className="input mb-2" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />

              <select className="input mb-3" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn-primary w-full">Save</button>
                <button onClick={() => setEditTask(null)} className="btn-danger w-full">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


