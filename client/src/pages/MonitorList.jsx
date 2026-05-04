import React, { useState } from 'react';
import { useGetMonitorsQuery, useDeleteMonitorMutation, useTriggerCheckMutation } from '../store/slices/monitorsApiSlice';
import { useSelector } from 'react-redux';
import { Plus, Globe, RefreshCw, Trash2, Edit2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import MonitorModal from '../components/Monitor/MonitorModal';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const MonitorList = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const { data: monitors, isLoading, error } = useGetMonitorsQuery();
  const [deleteMonitor] = useDeleteMonitorMutation();
  const [triggerCheck] = useTriggerCheckMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this monitor?')) {
      try {
        await deleteMonitor(id).unwrap();
        toast.success('Monitor deleted');
      } catch (err) {
        toast.error('Failed to delete monitor');
      }
    }
  };

  const handleManualCheck = async (id) => {
    try {
      toast.promise(triggerCheck(id).unwrap(), {
        loading: 'Checking...',
        success: 'Check complete!',
        error: 'Check failed'
      });
    } catch (err) {}
  };

  const openEditModal = (monitor) => {
    setSelectedMonitor(monitor);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedMonitor(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-white">Loading monitors...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="text-indigo-400" /> Smart Monitoring
          </h1>
          <p className="text-gray-400 mt-1">Real-time uptime and performance tracking</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} /> Add Monitor
          </button>
        )}
      </div>

      {monitors?.length === 0 ? (
        <div className="bg-[#1a1b23] border border-dashed border-white/10 rounded-2xl p-12 text-center">
          <Globe size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No monitors found</h3>
          <p className="text-gray-400 mb-6">Start tracking your services by adding your first monitor.</p>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Add Monitor Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {monitors?.map((monitor) => (
            <div key={monitor._id} className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group w-full overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  monitor.status === 'up' ? 'bg-green-500/10 text-green-500' : 
                  monitor.status === 'down' ? 'bg-red-500/10 text-red-500' : 
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  <Globe size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleManualCheck(monitor._id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Run check now"
                  >
                    <RefreshCw size={18} />
                  </button>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => openEditModal(monitor)}
                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(monitor._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{monitor.name}</h3>
              <p className="text-sm text-gray-400 mb-4 truncate" title={monitor.url}>{monitor.url}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm mt-auto border-t border-white/5 pt-4">
                <div className="flex items-center gap-1.5">
                  {monitor.status === 'up' ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-green-500 font-medium uppercase tracking-wider text-xs">Operational</span>
                    </>
                  ) : monitor.status === 'down' ? (
                    <>
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-red-500 font-medium uppercase tracking-wider text-xs">Outage</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-yellow-500" />
                      <span className="text-yellow-500 font-medium uppercase tracking-wider text-xs">Pending</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-gray-500 ml-auto">
                  <Clock size={14} />
                  <span>
                    {monitor.lastCheckedAt 
                      ? formatDistanceToNow(new Date(monitor.lastCheckedAt)) + ' ago'
                      : 'Never checked'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        monitor={selectedMonitor}
      />
    </div>
  );
};

export default MonitorList;
