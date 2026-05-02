import { useSelector } from 'react-redux';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  ChevronRight,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { useGetIncidentsQuery } from '../store/slices/incidentsApiSlice';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-slate-900/40 border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:bg-slate-900/60 transition-all">
    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white shadow-sm`}>
        <Icon size={24} className="opacity-80" />
      </div>
    </div>
    <div className="mt-6 flex items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
        <TrendingUp size={12} /> {change}
      </span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">vs last 24h</span>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-all" />
  </div>
);

const ActivityItem = ({ incident }) => (
  <Link to={`/incidents/${incident._id}`} className="group block">
    <div className="flex items-center justify-between p-5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-primary-500/30 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          incident.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 
          incident.status === 'investigating' ? 'bg-primary-500/10 text-primary-500' : 'bg-red-500/10 text-red-500'
        }`}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors truncate max-w-[200px] md:max-w-md">
            {incident.title}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
             Updated {formatDistanceToNow(new Date(incident.updatedAt))} ago
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
         <div className="hidden md:flex items-center gap-3">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded border ${
               incident.severity === 'critical' ? 'border-red-500/20 text-red-400 bg-red-500/5' : 
               incident.severity === 'high' ? 'border-orange-500/20 text-orange-400 bg-orange-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
            }`}>
               {incident.severity}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{incident.status}</span>
         </div>
         <ChevronRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: incidents, isLoading } = useGetIncidentsQuery();

  const active = incidents?.filter(i => i.status !== 'resolved') || [];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto pb-24">
      {/* Header: Human-Scale Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-black text-primary-500 uppercase tracking-[0.2em]">
             <Activity size={16} className="animate-pulse" />
             Operational Status: Online
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
            Welcome back, {user?.name.split(' ')[0]}.
          </h1>
          <p className="text-lg text-slate-400 font-medium">Monitoring your infrastructure resilience in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/admin/ingest" className="h-12 px-6 rounded-lg bg-white/5 border border-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Clock size={16} className="text-slate-400" /> System Logs
           </Link>
           <Link to="/incidents" className="h-12 px-6 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2">
              <Zap size={18} /> New Incident
           </Link>
        </div>
      </div>

      {/* High-Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Incidents" value={active.length} change="+2" icon={ShieldAlert} color="bg-red-500" />
        <StatCard title="Avg Resolution" value="24m" change="-12%" icon={Clock} color="bg-primary-500" />
        <StatCard title="Uptime (24h)" value="99.98%" change="+0.02%" icon={Activity} color="bg-green-500" />
        <StatCard title="Active Units" value={user?.role === 'admin' ? "12" : "3"} change="0%" icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Primary Feed: Active Incidents */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
               Operational Feed <div className="w-2 h-2 rounded-full bg-primary-500" />
            </h2>
            <Link to="/incidents" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">View All Archive</Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="h-24 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
               ))}
            </div>
          ) : active.length > 0 ? (
            <div className="grid gap-4">
              {active.slice(0, 5).map(incident => (
                <ActivityItem key={incident._id} incident={incident} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-white/10 p-24 rounded-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
                 <CheckCircle2 size={40} className="opacity-40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">All Systems Nominal</h3>
                <p className="text-base text-slate-400 max-w-sm mx-auto">No active incidents found. Your infrastructure is performing at peak efficiency.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Intelligence */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl p-8 shadow-2xl shadow-primary-500/10 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest opacity-80">Network Protocol</span>
                    <MoreVertical size={20} className="opacity-60 cursor-pointer" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight">System Shield</h3>
                    <p className="text-sm font-medium text-primary-100 opacity-90">Stability layer is fully active and protected.</p>
                 </div>
                 <div className="pt-4 flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                       <div className="h-full bg-white w-[88%] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>
                    <span className="text-sm font-bold">88%</span>
                 </div>
              </div>
              <ShieldAlert size={140} className="absolute -right-10 -bottom-10 opacity-10 -rotate-12" />
           </div>

           <div className="space-y-6">
              <h3 className="px-2 text-xs font-black text-slate-500 uppercase tracking-widest">Infrastructure Status</h3>
              <div className="space-y-4">
                 {[
                   { label: "Network Load", value: "Normal", color: "text-green-500" },
                   { label: "Global Error Rate", value: "0.04%", color: "text-primary-400" },
                   { label: "Pending Postmortems", value: "2", color: "text-orange-400" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-5 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-sm font-bold text-slate-400">{item.label}</span>
                      <span className={`text-sm font-black uppercase tracking-widest ${item.color}`}>{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-6 rounded-lg border border-dashed border-white/10 bg-white/[0.01] text-center">
              <p className="text-xs font-bold text-slate-500 mb-3">Operational assistance required?</p>
              <button className="text-sm font-bold text-white hover:text-primary-400 transition-colors underline underline-offset-4">Access Knowledge Base</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
