import { useState } from 'react';
import { useGetIncidentsQuery } from '../store/slices/incidentsApiSlice';
import { 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  ChevronRight,
  Clock,
  Activity,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import CreateIncidentModal from '../components/Incident/CreateIncidentModal';
import { useSelector } from 'react-redux';

const IncidentList = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: incidents, isLoading } = useGetIncidentsQuery({
    search: searchTerm,
    status: statusFilter,
    severity: severityFilter
  });

  if (isLoading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents</h1>
          <p className="text-slate-500 mt-1">Manage and track all system incidents.</p>
        </div>
        {(user.role === 'admin' || user.role === 'responder') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Create Incident
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search incidents by title or description..." 
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="input w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="investigating">Investigating</option>
            <option value="identified">Identified</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
          <select 
            className="input w-40"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="card divide-y divide-slate-100 dark:divide-slate-700">
        {incidents?.length > 0 ? (
          incidents.map((incident) => (
            <Link 
              key={incident._id} 
              to={`/incidents/${incident._id}`}
              className="flex items-center gap-6 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className={`w-2 h-12 rounded-full ${
                incident.severity === 'critical' ? 'bg-red-500' : 
                incident.severity === 'major' ? 'bg-orange-500' : 'bg-yellow-500'
              }`}></div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{incident.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    incident.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    incident.status === 'investigating' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Activity size={12}/> {incident.service}</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {formatDistanceToNow(new Date(incident.createdAt))} ago</span>
                  <span className="flex items-center gap-1"><User size={12}/> {incident.createdBy?.name || 'System'}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {incident.responders?.slice(0, 3).map((r, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {r.user?.name?.charAt(0)}
                    </div>
                  ))}
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Filter size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium">No incidents found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <CreateIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default IncidentList;
