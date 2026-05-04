import { useState } from 'react';
import { useGetIncidentsQuery, useCreateIncidentMutation } from '../store/slices/incidentsApiSlice';
import {
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Clock,
  ShieldAlert,
  Activity,
  Plus,
  ArrowUpDown,
  X,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import useSocket from '../hooks/useSocket';

const IncidentRow = ({ incident }) => (
  <Link
    to={`/incidents/${incident._id}`}
    className="group block p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-500/30 hover:bg-white/[0.04] transition-all"
  >
    <div className="flex items-start gap-4 md:gap-6">
      {/* Icon Area */}
      <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
        incident.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
        incident.status === 'investigating' ? 'bg-primary-500/10 text-primary-500' : 'bg-red-500/10 text-red-500'
      }`}>
        <ShieldAlert size={24} className="md:w-7 md:h-7" />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg font-bold text-white truncate group-hover:text-primary-400 transition-colors">
            {incident.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
              incident.severity === 'critical' ? 'border-red-500/20 text-red-400 bg-red-500/5' :
              incident.severity === 'high' ? 'border-orange-500/20 text-orange-400 bg-orange-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
            }`}>
              {incident.severity}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{incident.service}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-slate-500" />
            {formatDistanceToNow(new Date(incident.createdAt))} ago
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-slate-500" />
            {incident.status}
          </div>
        </div>
      </div>
    </div>

    {/* Footer Link Area */}
    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-primary-500 transition-colors">View Full Protocol</span>
      <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  </Link>
);

const DeclareModal = ({ isOpen, onClose }) => {
  const [createIncident, { isLoading }] = useCreateIncidentMutation();
  const [formData, setFormData] = useState({
    title: '',
    severity: 'medium',
    description: '',
    service: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.service) return toast.error('Please fill all required protocols.');

    try {
      await createIncident(formData).unwrap();
      toast.success('Incident Declared & Team Mobilized');
      onClose();
      setFormData({ title: '', severity: 'medium', description: '', service: '' });
    } catch (err) {
      toast.error('Protocol Failure: ' + (err.data?.message || 'Check connection'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={24} />
              Declare Incident Protocol
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priority Command Initiation</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Incident Hash Title</label>
                <input
                  autoFocus
                  placeholder="e.g. Core Latency Spike"
                  className="w-full bg-white/[0.03] border border-white/10 text-white h-12 px-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-sm font-medium placeholder:text-slate-700"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Affected Service</label>
                <input
                  placeholder="e.g. payment-gateway"
                  className="w-full bg-white/[0.03] border border-white/10 text-white h-12 px-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-sm font-medium placeholder:text-slate-700"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Severity Protocol</label>
              <div className="grid grid-cols-4 gap-3">
                {['low', 'medium', 'high', 'critical'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: s })}
                    className={`h-11 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${formData.severity === s
                        ? s === 'critical' ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' :
                          s === 'high' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' :
                            s === 'medium' ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' :
                              'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Incident Summary & Context</label>
              <textarea
                placeholder="Provide a high-level briefing of the current operational state..."
                className="w-full bg-white/[0.03] border border-white/10 text-white p-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-base font-medium min-h-[120px] resize-none placeholder:text-slate-700"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-12 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
              Mobilize Response Unit
            </button>
          </div>
        </form>

        <div className="p-4 bg-primary-600/5 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-primary-500/70 uppercase tracking-[0.2em]">All responders will be notified via IncidentX Protocol</p>
        </div>
      </div>
    </div>
  );
};

const IncidentList = () => {
  useSocket();
  const { data: incidents, isLoading } = useGetIncidentsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first

  const filteredIncidents = incidents?.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || i.status === activeFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto pb-24">
      <DeclareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header: Command List */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Incident Protocol</h1>
          <p className="text-sm md:text-base text-slate-400 font-medium">Monitoring and archival system for all infrastructure events.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto h-12 px-8 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Declare Incident
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col gap-6 bg-slate-900/40 p-5 md:p-6 rounded-xl border border-white/5 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search incident logs..."
              className="w-full bg-white/[0.03] border border-white/10 text-white text-sm h-11 md:h-12 pl-14 pr-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
            {['all', 'investigating', 'identified', 'resolved'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`h-9 md:h-10 px-4 md:px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${activeFilter === filter
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {filter}
              </button>
            ))}
            <div className="w-[1px] h-6 bg-white/10 mx-2 flex-shrink-0" />
            <button 
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className={`h-9 md:h-10 px-4 rounded-lg transition-all flex-shrink-0 ${sortOrder === 'asc' ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-400'}`}
              title={sortOrder === 'desc' ? "Newest First" : "Oldest First"}
            >
              <ArrowUpDown size={16} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          </div>
        </div>
      </div>

      {/* Incident List: Professional Rows */}
      <div className="space-y-4 md:space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : sortedIncidents.length > 0 ? (
          <div className="grid gap-4">
            {sortedIncidents.map(incident => (
              <IncidentRow key={incident._id} incident={incident} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-dashed border-white/10 py-20 md:py-28 rounded-xl text-center space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-700">
              <Filter size={32} className="md:w-10 md:h-10" />
            </div>
            <div className="space-y-2 px-6">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">No incident protocol found</h3>
              <p className="text-sm md:text-base text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search terms to find the specific event protocol.</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 md:pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 md:px-6">
        <span>Displaying {filteredIncidents.length} Records Found</span>
        <div className="flex gap-10">
          <button 
            onClick={() => toast.success('Protocol: Fetching previous data cluster...')}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Previous
          </button>
          <button 
            onClick={() => toast.success('Protocol: Reached end of current operational feed.')}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentList;
