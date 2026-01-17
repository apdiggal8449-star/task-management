import { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const {
    tasks,
    loading,
    page,
    pages,
    nextPage,
    prevPage,
    deleteTask,
    fetchTasks, // 🔥 Fetch tasks for filter
  } = useContext(TaskContext);

  const { user } = useContext(AuthContext);

  const [searchStatus, setSearchStatus] = useState('all'); // 🔥 Filter state

  if (!user) return null;

  // 🔥 Filter tasks by user & status
  const filteredTasks = tasks.filter((t) => {
    const statusMatch =
      searchStatus === 'all' ? true : t.status === searchStatus;

    const userMatch = user.role === 'user' ? t.userId === user.id : true;

    return statusMatch && userMatch;
  });

  // 🔥 Trigger fetch on status change (optional)
  useEffect(() => {
    fetchTasks(1);
  }, [searchStatus]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🔥 Title */}
      <h1 className="text-3xl font-bold mb-2">
        {user.role === 'admin' ? 'Admin Dashboard' : 'My Tasks'}
      </h1>

      {/* 🔥 USER ONLY INFO */}
      {user.role === 'user' && (
        <p className="text-sm text-gray-600 mb-4">
          User only: Can create and read tasks
        </p>
      )}

      {/* 🔥 CREATE BUTTON (USER ONLY) */}
      {user.role === 'user' && (
        <Link
          to="/create"
          className="inline-block mb-4 bg-black text-white px-4 py-2 rounded"
        >
          + Create Task
        </Link>
      )}

      {/* 🔥 STATUS FILTER */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm font-medium">Filter by Status:</label>
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* 🔥 LOADING */}
      {loading && <p>Loading...</p>}

      {/* 🔥 EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <p className="text-gray-500">No tasks found</p>
      )}

      {/* 🔥 TASK LIST */}
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 shadow mb-3 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-xs mt-1">
              Status: <b>{task.status}</b> | Due:{' '}
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>

          {/* 🔥 ADMIN CONTROLS */}
          {user.role === 'admin' && (
            <div className="flex gap-3">
              <Link
                to={`/edit/${task._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* 🔥 PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page} of {pages}
          </span>

          <button
            onClick={nextPage}
            disabled={page === pages}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
