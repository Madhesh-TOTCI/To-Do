import React, { useState, useEffect } from 'react';

// --- Build-Safe Icons ---
const IconSword = () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 13l2 2"></path></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>;

function App() {
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Common');
  // Timer State
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('quest-data');
    if (saved) {
      const data = JSON.parse(saved);
      setTasks(data.tasks || []);
      setXp(data.xp || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quest-data', JSON.stringify({ tasks, xp }));
  }, [tasks, xp]);

  // Pomodoro Logic
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      priority,
      completed: false,
      xpValue: priority === 'Legendary' ? 100 : priority === 'Rare' ? 50 : 20
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
  };

  const completeTask = (task) => {
    if (!task.completed) setXp(prev => prev + task.xpValue);
    else setXp(prev => Math.max(0, prev - task.xpValue));
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
  };

  const level = Math.floor(xp / 200) + 1;
  const currentLevelXp = xp % 200;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono p-4 md:p-10 selection:bg-cyan-500">
      
      {/* PLAYER STATS HEADER */}
      <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.03] p-8 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(6,182,212,0.4)]">
             🛡️
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">Player_Level {level}</h2>
            <div className="w-48 h-3 bg-white/10 rounded-full mt-2 overflow-hidden border border-white/5">
              <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-500" style={{ width: `${(currentLevelXp / 200) * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-cyan-400 mt-1 font-bold">{currentLevelXp} / 200 XP TO NEXT LEVEL</p>
          </div>
        </div>

        {/* POMODORO TIMER */}
        <div className="bg-black/40 px-8 py-4 rounded-2xl border border-white/5 text-center">
           <div className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2 justify-center italic">
             <IconClock /> Focus_Mode
           </div>
           <div className="text-3xl font-black text-white tracking-widest">
             {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
           </div>
           <button onClick={() => setIsActive(!isActive)} className={`mt-2 text-[10px] font-black uppercase px-4 py-1 rounded-lg ${isActive ? 'bg-rose-500/20 text-rose-500' : 'bg-cyan-500 text-black'}`}>
             {isActive ? '[ Pause ]' : '[ Ingratiate ]'}
           </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
        
        {/* QUEST LOG (COL 1) */}
        <div>
           <h3 className="text-cyan-500 text-xs font-black tracking-[0.4em] mb-6 flex items-center gap-2 uppercase">
             <IconSword /> Active_Missions
           </h3>
           
           <form onSubmit={addTask} className="mb-8 space-y-2">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-cyan-500/50 text-white"
                placeholder="Declare a new quest..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex gap-2">
                {['Common', 'Rare', 'Legendary'].map(p => (
                   <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${priority === p ? 'bg-cyan-500 text-black border-cyan-500' : 'border-white/10 text-slate-500'}`}>
                     {p}
                   </button>
                ))}
              </div>
              <button className="w-full bg-white text-black py-3 rounded-xl font-black uppercase hover:bg-cyan-400 transition-colors mt-2">Begin Quest</button>
           </form>

           <div className="space-y-4">
              {tasks.filter(t => !t.completed).map(task => (
                <div key={task.id} className="group bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
                   {editingId === task.id ? (
                     <div className="flex gap-2">
                        <input className="flex-1 bg-black rounded-lg px-4 py-1 text-sm outline-none border border-cyan-500" value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
                        <button onClick={() => saveEdit(task.id)} className="text-[10px] font-bold text-cyan-400">SAVE</button>
                     </div>
                   ) : (
                     <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border mb-2 inline-block ${task.priority === 'Legendary' ? 'border-amber-500 text-amber-500' : task.priority === 'Rare' ? 'border-purple-500 text-purple-500' : 'border-slate-600 text-slate-600'}`}>
                            {task.priority} (+{task.xpValue} XP)
                          </span>
                          <h4 className="text-lg font-bold text-slate-200">{task.title}</h4>
                          <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => { setEditingId(task.id); setEditValue(task.title); }} className="text-[9px] font-bold text-slate-600 hover:text-white uppercase transition-colors">Modify</button>
                             <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-[9px] font-bold text-slate-600 hover:text-rose-500 uppercase transition-colors">Discard</button>
                          </div>
                        </div>
                        <button onClick={() => completeTask(task)} className="h-12 w-12 rounded-xl border border-white/10 flex items-center justify-center text-slate-600 hover:border-cyan-500 hover:text-cyan-500 transition-all">
                          <IconSword />
                        </button>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* ARCHIVE (COL 2) */}
        <div>
           <h3 className="text-rose-500 text-xs font-black tracking-[0.4em] mb-6 flex items-center gap-2 uppercase">
             ⚔️ Victory_Vault
           </h3>
           <div className="space-y-3">
              {tasks.filter(t => t.completed).map(task => (
                <div key={task.id} className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl opacity-40 hover:opacity-100 transition-all">
                   <div className="flex justify-between items-center">
                      <p className="text-slate-400 line-through italic font-bold">Quest: {task.title}</p>
                      <button onClick={() => completeTask(task)} className="text-emerald-500">✔</button>
                   </div>
                   <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="mt-3 text-[9px] font-bold text-slate-700 hover:text-rose-500"><IconTrash /></button>
                </div>
              ))}
              {tasks.filter(t => t.completed).length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">No victories recorded yet</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

export default App;
