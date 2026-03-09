import React, { useState, useEffect } from 'react';
import { CheckSquare, ListTodo, Layers, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/taskApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
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
      setError('Connection failed. Please check your backend URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await createTask({ title, completed: false });
      setTasks([data, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error('Error adding task');
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const { data } = await updateTask(id, { completed: !currentStatus });
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error('Error updating task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting task');
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDEE9] via-[#B5FFFC] to-[#CFBAF0] pb-12 font-sans">
      {/* Dynamic Header */}
      <nav className="backdrop-blur-md bg-white/30 sticky top-0 z-10 border-b border-white/20 py-4 mb-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-2xl shadow-lg shadow-indigo-200 text-white">
              <CheckSquare size={26} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-800">
              Vibrant<span className="text-indigo-600">Tasks</span>
            </h1>
          </div>
          <div className="bg-white/50 px-4 py-1.5 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-white/40">
            {greeting()} ✨
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-3xl border border-white/50 shadow-xl shadow-blue-100/20 text-center">
            <Layers className="mx-auto mb-1 text-blue-500" size={20} />
            <p className="text-[10px] uppercase font-black text-gray-400">Total</p>
            <p className="text-xl font-black text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-3xl border border-white/50 shadow-xl shadow-purple-100/20 text-center">
            <ListTodo className="mx-auto mb-1 text-purple-500" size={20} />
            <p className="text-[10px] uppercase font-black text-gray-400">Pending</p>
            <p className="text-xl font-black text-gray-800">{tasks.filter(t => !t.completed).length}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-4 rounded-3xl border border-white/50 shadow-xl shadow-green-100/20 text-center">
            <CheckSquare className="mx-auto mb-1 text-green-500" size={20} />
            <p className="text-[10px] uppercase font-black text-gray-400">Done</p>
            <p className="text-xl font-black text-gray-800">{tasks.filter(t => t.completed).length}</p>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex gap-2">
            <input 
              className="flex-1 bg-white border-none rounded-2xl px-6 py-4 shadow-xl focus:ring-4 focus:ring-indigo-200 outline-none transition-all placeholder:text-gray-400 font-medium"
              placeholder="What's your next big goal?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-90 flex items-center justify-center">
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-white/80 p-4 rounded-2xl border-l-4 border-rose-500 shadow-md mb-6 flex items-center gap-3 text-rose-600 font-bold">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin mb-4 inline-block"><Sparkles className="text-indigo-500" size={40} /></div>
              <p className="font-bold text-gray-500">Curating your list...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-[2rem] border-2 border-dashed border-white/60">
              <p className="text-gray-500 font-medium">Your list is clean. Enjoy your day! 🌈</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task._id} 
                className={`group flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                  task.completed ? 'bg-white/40 scale-[0.98]' : 'bg-white shadow-indigo-100/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => handleToggleTask(task._id, task.completed)}
                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                      task.completed ? 'bg-green-500 border-green-500 shadow-lg shadow-green-200' : 'border-gray-200 hover:border-indigo-400'
                    }`}
                  >
                    {task.completed && <Plus className="text-white rotate-45" size={18} strokeWidth={4} />}
                  </button>
                  <span className={`text-lg font-bold transition-all ${
                    task.completed ? 'line-through text-gray-400 opacity-60' : 'text-gray-700'
                  }`}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
