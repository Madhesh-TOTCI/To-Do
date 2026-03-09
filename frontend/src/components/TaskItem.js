import React from 'react';
import { Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
    const priorityColors = {
        low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        high: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    return (
        <div className={`task-card flex items-center justify-between p-4 mb-3 bg-white border border-gray-100 rounded-2xl shadow-sm ${task.completed ? 'opacity-75' : ''}`}>
            <div className="flex items-center gap-4 flex-grow">
                <button 
                    onClick={() => onToggle(task._id, !task.completed)}
                    className="text-brand-primary hover:scale-110 transition-transform"
                >
                    {task.completed ? (
                        <CheckCircle size={24} className="text-brand-success" />
                    ) : (
                        <Circle size={24} className="text-gray-300" />
                    )}
                </button>
                <div className="flex flex-col">
                    <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                        {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <AlertCircle size={10} />
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => onDelete(task._id)}
                className="p-2 text-gray-400 hover:text-brand-danger hover:bg-rose-50 rounded-lg transition-all"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};

export default TaskItem;
