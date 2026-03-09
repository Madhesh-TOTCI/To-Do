import React, { useState, useEffect } from 'react';

// --- Sharp, Professional Inline Icons ---
const IconPlus = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconMore = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Work');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('executive-tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('executive-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      title: input.trim(),
      category: category,
      completed: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const handleEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-[#080808] text-[#e1e1e1] font-sans antialiased selection:bg-indigo-500/30">
      
      {/* SIDEBAR NAVIGATION (Visual Only for Layout) */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#0c0c0c] border-r border-white/5 hidden xl:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">E</div>
          <span className="font-bold tracking-tight text-white">Executive Control</span>
        </div>
        <nav className="space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-md bg-white/5 text-sm font-medium text-white transition-colors">All Issues</button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-sm font-medium text-slate-500 hover:text-white transition-colors">My Tasks</button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-sm font-medium text-slate-500 hover:text-white transition-colors">Completed</button>
        </nav>
      </div>

      <main className="xl:ml-64 p-6 md:p-12 max-w-5xl mx-auto">
        
        {/* HEADER AREA */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Active Workspace</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and track your primary objectives.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Status</p>
               <p className="text-sm font-medium text-emerald-500">System Nominal</p>
             </div>
             <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
             <button onClick={() => setTasks([])} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-md bg-white/5">Flush Cache</button>
          </div>
        </header>

        {/* COMMAND INPUT BAR */}
        <div className="mb-16">
          <form onSubmit={addTask} className="group relative bg-[#111111] border border-white/5 rounded-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-2xl overflow-hidden">
             <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                <input 
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-white placeholder:text-slate-600"
                  placeholder="Task description..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex bg-[#0c0c0c] sm:bg-transparent">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-400 px-4 py-2 outline-none appearance-none hover:text-white cursor-pointer uppercase tracking-widest"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 font-bold text-xs uppercase transition-all flex items-center gap-2 whitespace-nowrap">
                    Add Instance <IconPlus />
                  </button>
                </div>
             </div>
          </form>
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-1 gap-12">
          
          {/* PENDING SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-4 px-2 text-slate-400">
               <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Inbox / {pending.length} Issues</span>
            </div>
            
            <div className="bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5 shadow-xl">
              {pending.map(task => (
                <div key={task.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-all">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 w-5 h-5 rounded border border-white/20 flex items-center justify-center text-transparent group-hover:border-indigo-500 hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"
                  >
                    <IconCheck />
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <input 
                        className="bg-white/5 w-full rounded px-2 py-1 text-white outline-none border border-white/10"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEdit(task.id)}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#f0f0f0] truncate">{task.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10 ${task.category === 'Urgent' ? 'text-rose-400 bg-rose-400/5 whitespace-nowrap' : 'text-slate-500 whitespace-nowrap'}`}>
                          {task.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-slate-600">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase whitespace-nowrap">
                      <IconClock /> {task.timestamp}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingId(task.id); setEditValue(task.title); }} className="p-1 hover:text-white"><IconMore /></button>
                      <button onClick={() => deleteTask(task.id)} className="text-[10px] font-bold hover:text-rose-500 uppercase transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <p className="p-12 text-center text-sm text-slate-600 font-medium italic">No active objectives in current queue.</p>}
            </div>
          </section>

          {/* COMPLETED SECTION */}
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-4 px-2 text-slate-600">
               <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Archive / {completed.length} Completed</span>
            </div>
            <div className="bg-transparent border border-white/5 rounded-xl divide-y divide-white/5">
               {completed.map(task => (
                 <div key={task.id} className="flex items-center justify-between px-6 py-4 opacity-40 hover:opacity-100 transition-opacity group">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTask(task.id)} className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white border border-indigo-500"><IconCheck /></button>
                      <span className="text-sm font-medium text-slate-300 line-through decoration-slate-600">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">Instance Closed</span>
                       <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-rose-500 transition-all text-xs">×</button>
                    </div>
                 </div>
               ))}
            </div>
          </section>

        </div>
      </main>
      
      {/* GLOBAL FOOTER */}
      <footer className="fixed bottom-0 right-0 p-6 flex items-center gap-8 text-slate-700 pointer-events-none">
        <div className="flex items-center gap-4">
           <p className="text-[9px] font-bold uppercase tracking-[0.5em]">System_Log_Ver_2.5.0</p>
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-900 border border-indigo-500 animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
