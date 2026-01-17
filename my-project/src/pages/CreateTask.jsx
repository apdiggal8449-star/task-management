import { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateTask() {
  const { fetchTasks } = useContext(TaskContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      return toast.error('Title is required');
    }
    // add this comment anywhere
// vercel redeploy test


    try {
      setLoading(true);

      await api.post('/tasks', form);

      toast.success('Task created successfully');

      // 🔥 turant dashboard update
      fetchTasks(1);

      navigate('/');
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Task</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 border"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full p-2 border"
          value={form.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          name="dueDate"
          className="w-full p-2 border"
          value={form.dueDate}
          onChange={handleChange}
        />
  
        {/* 🔥 CREATE BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Creating…' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
