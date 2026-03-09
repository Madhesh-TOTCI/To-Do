import React, { useState, useEffect } from 'react';

// --- Build-Safe Icons ---
const IconPlus = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSort = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="8" y2="18"></line></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('Newest'); // or 'Priority'
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks-v4');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('vibrant-tasks-v4', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      priority,
      dueDate: dueDate || 'No Date',
      completed: false,
      createdAt: new Date().getTime()
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my_tasks_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getPriorityWeight = (p) => p === 'High' ? 3 : p === 'Medium' ? 2 : 1;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'Priority') return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    return b.createdAt - a.createdAt;
  });

  const pending = sortedTasks.filter(t => !t.completed);
  const completed = sortedTasks.filter(t => t.completed);
  const progress = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen bg-[#0a0a0c] text-slate-300 font-sans p-6 md:p-12 transition-all duration-1000 ${progress === 100 && tasks.length > 0 ? 'bg-emerald-950/20 shadow-[inset_0_0_100px_rgba(16,185,129,0.1)]' : ''}`}>
      
      <div className="max-w-7xl mx-auto">
        
        {/* TOP DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
             <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Current Efficiency</h4>
             <div className="flex items-end gap-3 mt-2">
                <span className="text-4xl font-black text-white">{progress}%</span>
                <span className="text-emerald-500 text-xs font-bold mb-1">↑ Complete</span>
             </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem]">
             <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Priority Alert</h4>
             <div className="flex items-end gap-3 mt-2">
                <span className="text-4xl font-black text-rose-500">{pending.filter(t => t.priority === 'High').length}</span>
                <span className="text-rose-400 text-xs font-bold mb-1">High Focus</span>
             </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between">
             <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">System Data</h4>
             <button onClick={exportData} className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors mt-2 uppercase tracking-tighter">
                <IconDownload /> Backup to Local Machine
             </button>
          </div>
        </div>

        {/* INPUT BOX - ELITE BOX */}
        <section className="bg-white/[0.03] p-1.5 rounded-[3rem] border border-white/10 mb-20 max-w-4xl mx-auto shadow-2xl">
          <form onSubmit={handleAddTask} className="flex flex-col lg:flex-row gap-2">
             <input 
               className="flex-1 bg-transparent px-8 py-5 text-xl outline-none text-white font-medium placeholder:text-slate-700"
               placeholder="Write your next mission..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
             <div className="flex flex-wrap items-center gap-2 p-3 bg-black/40 rounded-[2.5rem]">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white/5 text-[10px] text-slate-400 font-bold px-4 py-2 rounded-xl outline-none border border-white/5" />
                <div className="h-6 w-[1px] bg-white/10 hidden md:block mx-1"></div>
                {['High', 'Medium', 'Low'].map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${priority === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-white'}`}>
                    {p}
                  </button>
                ))}
                <button type="submit" className="bg-white text-black h-12 w-12 flex items-center justify-center rounded-2xl hover:scale-110 active:scale-95 transition-all">
                  <IconPlus />
                </button>
             </div>
          </form>
        </section>

        {/* CONTROLS */}
        <div className="flex justify-between items-center mb-10 px-4">
           <div className="flex items-center gap-6">
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Workspace</h2>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                 <button onClick={() => setSortBy('Newest')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${sortBy === 'Newest' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>Newest</button>
                 <button onClick={() => setSortBy('Priority')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${sortBy === 'Priority' ? 'bg-white/10 text-white' : 'text-slate-600'}`}>Priority</button>
              </div>
           </div>
           {progress === 100 && tasks.length > 0 && <span className="text-emerald-500 text-[10px] font-black animate-bounce tracking-[0.3em]">ALL OBJECTIVES SECURED 🏆</span>}
        </div>

        {/* 2-COLUMN VIEW */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* PENDING */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-rose-500 border-b border-rose-500/10 pb-4">
               <IconSort /> <span className="text-xs font-black uppercase tracking-[0.4em]">Active Operations</span>
            </div>
            <div className="space-y-4">
              {pending.map(task => (
                <div key={task.id} className="group bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 relative">
                  <div className={`absolute top-8 left-0 w-1.5 h-12 rounded-r-full ${task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_15px_rose]' : 'bg-indigo-500'}`}></div>
                  
                  {editingId === task.id ? (
                    <div className="flex flex-col gap-4">
                      <input className="bg-white/10 rounded-2xl px-6 py-3 text-white outline-none border border-indigo-500/30" value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => { setTasks(tasks.map(t => t.id === task.id ? {...t, title: editValue} : t)); setEditingId(null); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black">SAVE</button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 px-6 py-2 font-black text-[10px]">CANCEL</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                           <div className="flex gap-2 items-center mb-2">
                              <span className="text-[8px] font-black uppercase text-indigo-400 border border-indigo-400/20 px-2 py-0.5 rounded-md">Priority {task.priority}</span>
                              <span className="text-[8px] font-black uppercase text-slate-500">Due: {task.dueDate}</span>
                           </div>
                           <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{task.title}</h3>
                        </div>
                        <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: true} : t))} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:bg-emerald-500 hover:text-white transition-all shadow-inner">
                           <IconPlus />
                        </button>
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditingId(task.id); setEditValue(task.title); }} className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest">Edit Entry</button>
                         <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-[9px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-widest"><IconTrash /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-emerald-500 border-b border-emerald-500/10 pb-4">
               <span className="text-xs font-black uppercase tracking-[0.4em]">Success Archive</span>
            </div>
            <div className="space-y-4">
              {completed.map(task => (
                <div key={task.id} className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem] p-8 opacity-40 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-center bg-transparent">
                    <p className="text-xl font-medium text-emerald-100/60 line-through italic">{task.title}</p>
                    <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: false} : t))} className="text-emerald-500">
                       <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
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
