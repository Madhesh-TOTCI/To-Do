import React, { useState, useEffect } from 'react';
import { CheckSquare, ListTodo, Trash2, Plus, Edit3, Save, X, Clock, CheckCircle2 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Save/Load from LocalStorage (No Backend needed!)
  useEffect(() => {
    const saved = localStorage.getItem('vibrant-tasks');
    if (saved) setTasks(JSON.parse(saved));
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
      createdAt: new Date().toLocaleTimeString()
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-200 via-pink-200 to-purple-300 p-4 md:p-8 font-sans transition-all">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-black text-gray-800 drop-shadow-sm mb-2 flex items-center justify-center gap-3">
             <div className="bg-black p-2 rounded-2xl shadow-xl shadow-purple-400/50"><SparkleIcon /></div>
             MY TASK MASTER
          </h1>
          <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">Organize • Accomplish • Repeat</p>
        </header>

        {/* Input Area */}
        <form onSubmit={handleAddTask} className="max-w-xl mx-auto mb-16 relative">
          <div className="flex gap-3 bg-white/40 p-3 rounded-[2.5rem] backdrop-blur-xl border-2 border-white shadow-2xl">
            <input 
              className="flex-1 bg-transparent px-6 py-3 outline-none text-gray-800 font-bold placeholder:text-gray-500 text-lg"
              placeholder="Type a new goal..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="bg-gray-900 hover:bg-black text-white px-8 rounded-full font-black shadow-lg transition-all active:scale-90 flex items-center gap-2">
              ADD <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </form>

        {/* Board Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: PENDING */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-red-600 flex items-center gap-2">
                <Clock /> PENDING STAGE <span className="bg-red-100 px-3 py-1 rounded-full text-sm">{pendingTasks.length}</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="bg-red-500 text-white p-5 rounded-[2rem] shadow-xl shadow-red-200 border-b-8 border-red-700 flex flex-col gap-3 group animate-in slide-in-from-left duration-300">
                  {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-white/20 rounded-xl px-4 py-1 text-white placeholder:text-red-200 outline-none border-2 border-white/50 font-bold"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => saveEdit(task.id)} className="bg-white text-red-600 p-2 rounded-xl hover:bg-green-50"><Save size={20} /></button>
                      <button onClick={() => setEditingId(null)} className="bg-white/20 p-2 rounded-xl"><X size={20} /></button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="text-xl font-bold leading-tight">{task.title}</span>
                        <input 
                           type="checkbox" 
                           checked={task.completed}
                           onChange={() => handleToggleTask(task.id)}
                           className="w-8 h-8 rounded-full border-4 border-white appearance-none checked:bg-white cursor-pointer transition-all hover:scale-110"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/20">
                        <span className="text-[10px] font-black opacity-60">ADDED: {task.createdAt}</span>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(task)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Edit3 size={18} /></button>
                          <button onClick={() => handleDeleteTask(task.id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {pendingTasks.length === 0 && <EmptyState color="red" text="No pending work! Take a break." />}
            </div>
          </section>

          {/* COLUMN 2: COMPLETED */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-green-600 flex items-center gap-2">
                <CheckCircle2 /> COMPLETED STAGE <span className="bg-green-100 px-3 py-1 rounded-full text-sm">{completedTasks.length}</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              {completedTasks.map(task => (
                <div key={task.id} className="bg-green-500 text-white p-5 rounded-[2rem] shadow-xl shadow-green-200 border-b-8 border-green-700 flex flex-col gap-3 animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-between items-start">
                    <span className="text-xl font-bold italic line-through opacity-80">{task.title}</span>
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600"
                    >
                      <CheckCircle2 size={24} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/20">
                    <span className="text-[10px] font-black opacity-60">COMPLETED! 🏆</span>
                    <button onClick={() => handleDeleteTask(task.id)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && <EmptyState color="green" text="Nothing finished yet. Keep going!" />}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
const SparkleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#A855F7" />
  </svg>
);

const EmptyState = ({ color, text }) => (
  <div className={`text-center py-10 rounded-[2rem] border-4 border-dashed border-${color}-400/30`}>
    <p className={`text-${color}-600 font-bold opacity-50`}>{text}</p>
  </div>
);

export default App;
