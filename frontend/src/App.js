import React, { useState, useEffect } from 'react';

// --- Build-Safe Icons ---
const IconPlus = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks-pro');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('vibrant-tasks-pro', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      priority,
      completed: false,
      timestamp: new Date().toLocaleDateString()
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  const handleToggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const clearAll = () => { if(window.confirm("Clear all tasks?")) setTasks([]); };

  // Filter & Stats
  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const pending = filteredTasks.filter(t => !t.completed);
  const completed = filteredTasks.filter(t => t.completed);
  const progress = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-4 md:p-10 selection:bg-indigo-500">
      
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAV & PROGRESS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">ZEN<span className="text-indigo-500">FLOW</span></h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Intelligence Productivity</p>
          </div>
          
          <div className="w-full md:w-64 bg-white/5 h-3 rounded-full overflow-hidden border border-white/10 relative">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            <span className="absolute right-2 -top-1 text-[9px] font-black text-white">{progress}% DONE</span>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500"><IconSearch /></span>
              <input 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-indigo-500/50 w-40 md:w-60 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={clearAll} className="p-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl text-rose-500 transition-all border border-rose-500/20">
               <IconTrash />
            </button>
          </div>
        </div>

        {/* INPUT BOX */}
        <section className="max-w-3xl mx-auto mb-16 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-2">
             <input 
               className="flex-1 bg-transparent px-6 py-4 text-lg outline-none text-white font-medium"
               placeholder="Capture a new objective..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
             <div className="flex gap-2 p-2 bg-black/40 rounded-2xl">
                {['High', 'Medium', 'Low'].map(p => (
                  <button 
                    key={p} type="button" 
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${priority === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}
                  </button>
                ))}
                <button type="submit" className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1">
                  ADD <IconPlus />
                </button>
             </div>
          </form>
        </section>

        {/* DASHBOARD GRID */}
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* COLUMN: PENDING */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-rose-500 tracking-[0.3em] flex items-center gap-2 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rose]"></span>
              Active Objectives ({pending.length})
            </h2>
            <div className="space-y-4">
              {pending.map(task => (
                <div key={task.id} className="group bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-3xl p-6 hover:border-rose-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-blue-500'}`}></div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mb-2 inline-block border ${task.priority === 'High' ? 'border-rose-500/40 text-rose-500' : 'border-slate-500/40 text-slate-500'}`}>{task.priority}</span>
                      <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">{task.title}</h3>
                    </div>
                    <button onClick={() => handleToggle(task.id)} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                       <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                  </div>
                  <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-medium text-slate-600">INITIATED: {task.timestamp}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-rose-500"><IconTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN: COMPLETED */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-emerald-500 tracking-[0.3em] flex items-center gap-2 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]"></span>
              Archive ({completed.length})
            </h2>
            <div className="space-y-4">
              {completed.map(task => (
                <div key={task.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 opacity-60 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-emerald-100/50 line-through decoration-emerald-500 font-medium italic">{task.title}</p>
                    <button onClick={() => handleToggle(task.id)} className="text-emerald-500 scale-125">
                       <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-[9px] font-black text-emerald-900 border border-emerald-900/40 px-2 py-0.5 rounded-lg uppercase">Success</span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-700 hover:text-rose-500"><IconTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* MOTIVATIONAL FOOTER */}
      <footer className="mt-20 text-center text-[10px] font-bold text-slate-700 tracking-[0.5em] uppercase border-t border-white/5 pt-10">
        Stop Wishing • Start Doing
      </footer>
    </div>
  );
}

export default App;
