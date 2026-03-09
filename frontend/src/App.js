import React, { useState, useEffect } from 'react';

// --- Build-Safe Icons (Direct SVG) ---
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
);

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // LocalStorage logic
  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vibrant-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
            VIBRANT<span className="text-indigo-600">TASKS</span>
          </h1>
          <div className="h-1.5 w-20 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
        </header>

        <form onSubmit={handleAddTask} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
            <input 
              className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 font-semibold"
              placeholder="What needs doing?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-1">
              ADD <PlusIcon />
            </button>
          </div>
        </form>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* PENDING COLUMN */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-red-500 flex items-center gap-2 px-2 uppercase tracking-wider">
              ● Pending Stage ({pendingTasks.length})
            </h2>
            
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div key={task.id} className="bg-red-500 rounded-2xl p-4 shadow-lg shadow-red-100 border-b-4 border-red-700 transition-all">
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white/20 rounded-lg px-3 py-1 text-white outline-none border border-white/40 font-bold"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(task.id)} className="bg-white text-red-600 px-3 rounded-lg text-xs font-black">SAVE</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-bold text-white leading-tight">{task.title}</span>
                        <button 
                         onClick={() => handleToggleTask(task.id)}
                         className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                        >
                          <CheckIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] font-bold text-white/60">{task.createdAt}</span>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(task)} className="text-white/80 hover:text-white"><EditIcon /></button>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-white/80 hover:text-white"><TrashIcon /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-emerald-500 flex items-center gap-2 px-2 uppercase tracking-wider">
              ✔ Completed Stage ({completedTasks.length})
            </h2>
            
            <div className="space-y-3">
              {completedTasks.map(task => (
                <div key={task.id} className="bg-emerald-500 rounded-2xl p-4 shadow-lg shadow-emerald-100 border-b-4 border-emerald-700 opacity-90">
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold text-white line-through opacity-70 italic">{task.title}</span>
                    <button onClick={() => handleToggleTask(task.id)} className="text-white"><CheckIcon /></button>
                  </div>
                  <div className="flex justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold text-white/50">COMPLETED!</span>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-white/80 hover:text-white"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
