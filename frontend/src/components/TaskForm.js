import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onTaskAdded({ title, priority });
            setTitle('');
            setPriority('medium');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a new task..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-700"
                    required
                />
            </div>
            <div className="flex gap-4">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-700"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-primary hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    <PlusCircle size={20} />
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
