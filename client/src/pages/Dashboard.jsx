import { useGetIncidentsQuery } from '../store/slices/incidentsApiSlice';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Plus,
  Loader2,
  TrendingUp,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon, color, subtext }) => (
  <div className="card p-6 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><TrendingUp size={12}/> {subtext}</p>}
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      {icon}
    </div>
  </div>
);

const IncidentCard = ({ incident }) => (
  <Link to={`/incidents/${incident._id}`} className="block group">
    <div className={`card border-l-4 transition-all duration-200 hover:shadow-md ${
      incident.severity === 'critical' ? 'border-l-red-500' : 
      incident.severity === 'major' ? 'border-l-orange-500' : 'border-l-yellow-500'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{incident.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {incident.service}
              </span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                incident.status === 'resolved' ? 'bg-green-100 text-green-700' :
                incident.status === 'investigating' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {incident.status}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {incident.description || 'No description provided.'}
        </p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { data: incidents, isLoading } = useGetIncidentsQuery();

  if (isLoading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );

  const active = incidents?.filter(i => i.status !== 'resolved') || [];
  const resolvedToday = incidents?.filter(i => 
    i.status === 'resolved' && 
    new Date(i.resolvedAt).toDateString() === new Date().toDateString()
  ) || [];
  const critical = active.filter(i => i.severity === 'critical');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incident Control</h1>
          <p className="text-slate-500 mt-1">Real-time overview of system health.</p>
        </div>
        <Link to="/incidents" className="btn btn-primary">
          <Plus size={20} />
          Create Incident
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Incidents" value={active.length} icon={<AlertCircle className="text-red-600" />} color="bg-red-500" subtext={`${critical.length} critical`} />
        <StatCard title="Resolved Today" value={resolvedToday.length} icon={<CheckCircle2 className="text-green-600" />} color="bg-green-500" />
        <StatCard title="Avg. Resolve Time" value="42m" icon={<Clock className="text-primary-600" />} color="bg-primary-500" />
        <StatCard title="System Status" value={critical.length > 0 ? "Critical" : "Stable"} icon={<Activity className={critical.length > 0 ? "text-red-600" : "text-green-600"} />} color={critical.length > 0 ? "bg-red-500" : "bg-green-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Activity size={20} className="text-primary-600" /> Active Incidents</h2>
          {active.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {active.map(incident => <IncidentCard key={incident._id} incident={incident} />)}
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-500">All systems operational.</div>
          )}
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><History size={20} className="text-slate-500" /> Recently Resolved</h2>
          <div className="space-y-4">
            {incidents?.filter(i => i.status === 'resolved').slice(0, 5).map(incident => (
              <div key={incident._id} className="card p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <Link to={`/incidents/${incident._id}`} className="block">
                  <p className="font-semibold text-sm line-clamp-1">{incident.title}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{incident.service} • {formatDistanceToNow(new Date(incident.resolvedAt))} ago</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
