import React, { useState, useEffect } from 'react';

// --- Build-Safe Icons ---
const IconPlus = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSearch = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconEdit = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks-final');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('vibrant-tasks-final', JSON.stringify(tasks));
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

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
  };

  const handleToggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const clearAll = () => { if(window.confirm("Clear all tasks?")) setTasks([]); };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const pending = filteredTasks.filter(t => !t.completed);
  const completed = filteredTasks.filter(t => t.completed);
  const progress = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-4 md:px-10 py-12 selection:bg-indigo-500">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">TASK<span className="text-indigo-500">FLOW</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Performance Workspace</p>
          </div>
          
          <div className="flex-1 max-w-sm w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 relative mx-4">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex gap-3">
             <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500"><IconSearch /></span>
                <input 
                  placeholder="Filter..." 
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-indigo-500/50 w-32 md:w-52 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button onClick={clearAll} className="p-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl text-rose-500 transition-all border border-rose-500/20">
                <IconTrash />
             </button>
          </div>
        </div>

        {/* INPUT SECTION */}
        <section className="max-w-3xl mx-auto mb-20 bg-white/5 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-2">
             <input 
               className="flex-1 bg-transparent px-6 py-4 text-xl outline-none text-white font-medium placeholder:text-slate-700"
               placeholder="What's the next goal?"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
             <div className="flex gap-2 p-2 bg-black/40 rounded-[1.8rem]">
                {['High', 'Medium', 'Low'].map(p => (
                  <button 
                    key={p} type="button" onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase transition-all ${priority === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}
                  </button>
                ))}
                <button type="submit" className="bg-white text-black px-6 py-2 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1">
                  ADD <IconPlus />
                </button>
             </div>
          </form>
        </section>

        {/* BOARD */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* PENDING */}
          <div className="space-y-6">
            <h2 className="text-xs font-black text-rose-500 tracking-[0.4em] flex items-center gap-2 uppercase px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rose]"></span>
              Pending Objectives ({pending.length})
            </h2>
            <div className="space-y-4">
              {pending.map(task => (
                <div key={task.id} className="group bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-blue-500'}`}></div>
                  
                  {editingId === task.id ? (
                    <div className="flex flex-col gap-3">
                      <input 
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none font-bold"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(task.id)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">Save Change</button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">{task.priority} Priority</span>
                        <h3 className="text-xl font-bold text-white leading-snug">{task.title}</h3>
                        <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(task)} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase"><IconEdit /> Edit</button>
                          <button onClick={() => deleteTask(task.id)} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase"><IconTrash /> Remove</button>
                        </div>
                      </div>
                      <button onClick={() => handleToggle(task.id)} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                         <IconPlus /> {/* Recycled plus for check */}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED */}
          <div className="space-y-6">
            <h2 className="text-xs font-black text-emerald-500 tracking-[0.4em] flex items-center gap-2 uppercase px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]"></span>
              Completed Archive ({completed.length})
            </h2>
            <div className="space-y-4">
              {completed.map(task => (
                <div key={task.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 opacity-40 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-emerald-100/70 line-through decoration-emerald-500/50 font-medium italic">{task.title}</p>
                    <button onClick={() => handleToggle(task.id)} className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                       ✔
                    </button>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="mt-4 text-[10px] font-bold text-slate-700 hover:text-rose-500 uppercase tracking-widest">Delete Permanent</button>
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
