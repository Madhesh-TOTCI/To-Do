import React, { useState, useEffect } from 'react';

// --- Premium Inline Icons (Build-Safe) ---
const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks-v2');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('vibrant-tasks-v2', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="mb-4 px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">
            Work Space v2.0
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-500 tracking-tight text-center mb-4">
            Daily Manifest
          </h1>
          <p className="text-slate-500 font-medium">Capture your ideas, execute your goals.</p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAddTask} className="max-w-2xl mx-auto mb-20">
          <div className="group relative flex items-center p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl focus-within:border-indigo-500/50 transition-all duration-500">
            <input 
              className="flex-1 bg-transparent px-6 py-4 text-xl outline-none placeholder:text-slate-600 font-light"
              placeholder="Enter your next mission..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all">
              <IconPlus />
            </button>
          </div>
        </form>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* --- PENDING COLUMN --- */}
          <div>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse"></span>
                ACTIVE MISSIONS
              </h2>
              <span className="text-slate-600 text-sm font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10">{pending.length}</span>
            </div>

            <div className="space-y-4">
              {pending.map(task => (
                <div key={task.id} className="group relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 backdrop-blur-sm hover:border-rose-500/40 transition-all duration-300">
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white/10 rounded-xl px-4 py-2 border border-white/20 outline-none text-white font-medium"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(task.id)} className="bg-rose-500 p-2 rounded-xl text-white font-bold text-xs uppercase px-4 shadow-lg shadow-rose-500/20">Save</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-xl font-semibold leading-tight text-white group-hover:text-rose-100 transition-colors">{task.title}</p>
                        <button 
                          onClick={() => handleToggle(task.id)}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                        >
                          <IconCheck />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] uppercase tracking-widest text-rose-500/60 font-black">{task.timestamp}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingId(task.id); setEditValue(task.title); }} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><IconEdit /></button>
                          <button onClick={() => deleteTask(task.id)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 transition-colors"><IconTrash /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {pending.length === 0 && <EmptyView label="Zone clear" color="rose" />}
            </div>
          </div>

          {/* --- COMPLETED COLUMN --- */}
          <div>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl font-bold flex items-center gap-3 text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
                OBJECTIVES ACHIEVED
              </h2>
              <span className="text-slate-600 text-sm font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10">{completed.length}</span>
            </div>

            <div className="space-y-4">
              {completed.map(task => (
                <div key={task.id} className="group p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 opacity-60 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-lg font-medium text-emerald-100 italic line-through decoration-emerald-500/50">{task.title}</p>
                    <button onClick={() => handleToggle(task.id)} className="text-emerald-500 hover:scale-110 transition-transform"><IconCheck /></button>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black text-emerald-700 tracking-[0.2em] uppercase">Mission Complete</span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-rose-500 transition-colors"><IconTrash /></button>
                  </div>
                </div>
              ))}
              {completed.length === 0 && <EmptyView label="Nothing accomplished" color="emerald" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EmptyView = ({ label, color }) => (
  <div className={`p-10 border-2 border-dashed border-${color}-900/40 rounded-[2.5rem] flex flex-col items-center justify-center`}>
    <div className={`w-8 h-8 rounded-full bg-${color}-500/10 mb-2 border border-${color}-500/20`}></div>
    <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">{label}</p>
  </div>
);

export default App;
