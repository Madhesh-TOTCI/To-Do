import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/taskApi';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import { CheckSquare, ListTodo, Layers } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Is the server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const { data } = await createTask(taskData);
      setTasks([data, ...tasks]);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTask = async (id, completed) => {
    try {
      const { data } = await updateTask(id, { completed });
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-primary p-2 rounded-xl text-white">
              <CheckSquare size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-indigo-400">
              VibrantTasks
            </h1>
          </div>
          <div className="text-gray-500 font-medium text-sm hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-brand-mint p-4 rounded-2xl border border-teal-100 flex items-center gap-4">
             <div className="bg-teal-500/10 p-2 rounded-lg text-teal-600">
                <Layers size={20} />
             </div>
             <div>
                <p className="text-xs text-teal-600 uppercase font-bold">Total</p>
                <p className="text-xl font-bold text-teal-800">{tasks.length}</p>
             </div>
          </div>
          <div className="bg-brand-lavender p-4 rounded-2xl border border-brand-primary/10 flex items-center gap-4">
             <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                <ListTodo size={20} />
             </div>
             <div>
                <p className="text-xs text-brand-primary uppercase font-bold">Inbox</p>
                <p className="text-xl font-bold text-indigo-800">{tasks.filter(t => !t.completed).length}</p>
             </div>
          </div>
          <div className="bg-brand-pink p-4 rounded-2xl border border-rose-100 flex items-center gap-4">
             <div className="bg-rose-500/10 p-2 rounded-lg text-rose-600">
                <CheckSquare size={20} />
             </div>
             <div>
                <p className="text-xs text-rose-600 uppercase font-bold">Done</p>
                <p className="text-xl font-bold text-rose-800">{tasks.filter(t => t.completed).length}</p>
             </div>
          </div>
        </div>

        <TaskForm onTaskAdded={handleAddTask} />

        {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 mb-6 flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
            </div>
        )}

        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mb-2"></div>
              <p className="text-gray-500">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">Project list is empty. Start by adding a task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
