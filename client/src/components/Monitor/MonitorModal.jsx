import React, { useState, useEffect } from 'react';
import { useCreateMonitorMutation, useUpdateMonitorMutation } from '../../store/slices/monitorsApiSlice';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const MonitorModal = ({ isOpen, onClose, monitor = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    interval: 60
  });

  const [createMonitor, { isLoading: isCreating }] = useCreateMonitorMutation();
  const [updateMonitor, { isLoading: isUpdating }] = useUpdateMonitorMutation();

  useEffect(() => {
    if (monitor) {
      setFormData({
        name: monitor.name,
        url: monitor.url,
        interval: monitor.interval
      });
    } else {
      setFormData({ name: '', url: '', interval: 60 });
    }
  }, [monitor, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (monitor) {
        await updateMonitor({ id: monitor._id, ...formData }).unwrap();
        toast.success('Monitor updated');
      } else {
        await createMonitor(formData).unwrap();
        toast.success('Monitor created');
      }
      onClose();
    } catch (err) {
      toast.error(err.data?.message || 'Action failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1b23] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{monitor ? 'Edit Monitor' : 'Add New Monitor'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Friendly Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Production API"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Target URL</label>
            <input
              type="url"
              required
              placeholder="https://api.example.com/health"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Check Interval (seconds)</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={formData.interval}
              onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : monitor ? 'Update Monitor' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonitorModal;
