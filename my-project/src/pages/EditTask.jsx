import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });

  // 🔹 Fetch existing task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);

        setForm({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status,
          dueDate: res.data.dueDate
            ? res.data.dueDate.split('T')[0]
            : ''
        });
      } catch (err) {
        toast.error('Failed to load task');
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return toast.error('Title and Description required');
    }

    try {
      await api.put(`/tasks/${id}`, form);

      toast.success('Task updated successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Edit Task
        </h2>

        <input
          type="text"
          name="title"
          className="w-full p-2 border mb-3"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="w-full p-2 border mb-3"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full p-2 border mb-3"
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
          className="w-full p-2 border mb-4"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
