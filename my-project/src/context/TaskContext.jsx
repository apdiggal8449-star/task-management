import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 5;

  // 🔥 SEARCH + STATUS
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  // ================= FETCH TASKS =================
  const fetchTasks = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/tasks?page=${pageNumber}&limit=${limit}&search=${search}&status=${status}`
      );

      setTasks(res.data.tasks || []);
      setPages(res.data.pages || 1);
      setPage(res.data.page || pageNumber);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      // 🔥 delete ke baad same page reload
      fetchTasks(page);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // ================= PAGINATION =================
  const nextPage = () => {
    if (page < pages) fetchTasks(page + 1);
  };

  const prevPage = () => {
    if (page > 1) fetchTasks(page - 1);
  };

  // 🔥 search / status change → auto fetch
  useEffect(() => {
    fetchTasks(1);
  }, [search, status]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        page,
        pages,

        // 🔥 search & filter
        search,
        setSearch,
        status,
        setStatus,

        fetchTasks,
        deleteTask,
        nextPage,
        prevPage,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
