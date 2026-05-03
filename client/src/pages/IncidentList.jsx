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

const IncidentRow = ({ incident }) => (
  <Link 
    to={`/incidents/${incident._id}`} 
    className="group flex items-center justify-between p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary-500/30 hover:bg-white/[0.04] transition-all"
  >
    <div className="flex items-center gap-6 flex-1 min-w-0">
      <div className={`shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${
        incident.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 
        incident.status === 'investigating' ? 'bg-primary-500/10 text-primary-500' : 'bg-red-500/10 text-red-500'
      }`}>
        <ShieldAlert size={28} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-4">
          <h3 className="text-base font-bold text-white truncate group-hover:text-primary-400 transition-colors">
            {incident.title}
          </h3>
          <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            incident.severity === 'critical' ? 'border-red-500/20 text-red-400 bg-red-500/5' : 
            incident.severity === 'high' ? 'border-orange-500/20 text-orange-400 bg-orange-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
          }`}>
            {incident.severity}
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-2"><Clock size={14} /> {formatDistanceToNow(new Date(incident.createdAt))} ago</span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
           <span className="flex items-center gap-2"><Activity size={14} /> {incident.status}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-10 ml-8">
       <div className="hidden lg:flex flex-col items-end gap-1.5">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Affected Service</span>
          <span className="text-sm font-bold text-white uppercase">{incident.service}</span>
       </div>
       <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />
       <ChevronRight size={24} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Affected Service</label>
                    <input 
                      placeholder="e.g. payment-gateway"
                      className="w-full bg-white/[0.03] border border-white/10 text-white h-12 px-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-sm font-medium placeholder:text-slate-700"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
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
                        onClick={() => setFormData({...formData, severity: s})}
                        className={`h-11 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                          formData.severity === s 
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
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
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
    <div className="p-8 space-y-12 max-w-7xl mx-auto pb-24">
      <DeclareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header: Command List */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Incident Protocol</h1>
          <p className="text-base text-slate-400 font-medium">Monitoring and archival system for all infrastructure events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Declare Incident
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-900/40 p-6 rounded-xl border border-white/5 shadow-xl">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search incident logs or title..." 
            className="w-full bg-white/[0.03] border border-white/10 text-white text-base h-12 pl-14 pr-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {['all', 'investigating', 'identified', 'resolved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-10 px-5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="w-[1px] h-8 bg-white/10 mx-3" />
          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className={`h-10 px-5 rounded-lg transition-all ${sortOrder === 'asc' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            title={sortOrder === 'desc' ? "Newest First" : "Oldest First"}
          >
            <ArrowUpDown size={18} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
        </div>
      </div>

      {/* Incident List: Professional Rows */}
      <div className="space-y-5">
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
          <div className="bg-slate-900/30 border border-dashed border-white/10 p-28 rounded-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-700">
               <Filter size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">No incident protocol found</h3>
              <p className="text-base text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search terms to find the specific event protocol.</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-10 flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest px-6">
         <span>Displaying {filteredIncidents.length} Records Found</span>
         <div className="flex gap-8">
            <button className="hover:text-white transition-colors underline underline-offset-4">Previous</button>
            <button className="hover:text-white transition-colors underline underline-offset-4">Next Page</button>
         </div>
      </div>
    </div>
  );
};

export default IncidentList;
