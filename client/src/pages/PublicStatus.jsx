import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Clock,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const PublicStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:10000/api'}/status/public`);
      setData(res.data);
    } catch (err) { console.error('Failed to fetch status'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed ${email} to status updates!`);
    setEmail('');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><ShieldCheck className="animate-pulse text-primary-600" size={64} /></div>;

  const statusMap = {
    'operational': { label: 'All Systems Operational', icon: <CheckCircle2 size={40} />, color: 'bg-green-500' },
    'degraded': { label: 'Degraded Performance', icon: <AlertTriangle size={40} />, color: 'bg-yellow-500' },
    'major-outage': { label: 'Major System Outage', icon: <AlertOctagon size={40} />, color: 'bg-red-500' }
  };

  const status = statusMap[data?.overallStatus] || statusMap.operational;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xl"><ShieldCheck size={32} /><span>Incident X</span></div>
          <a href="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">Internal Login</a>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className={`rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center gap-6 transition-colors duration-500 ${status.color}`}>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">{status.icon}</div>
          <div className="text-center md:text-left"><h1 className="text-3xl font-bold">{status.label}</h1><p className="opacity-90 mt-1">Last updated: {new Date().toLocaleTimeString()}</p></div>
        </div>
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">Active Incidents <span className="text-sm font-normal text-slate-400 ml-2">({data?.activeIncidents?.length})</span></h2>
          {data?.activeIncidents?.length > 0 ? (
            <div className="space-y-4">
              {data.activeIncidents.map(incident => (
                <div key={incident._id} className="card p-6 border-l-4 border-l-red-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{incident.title}</h3>
                    <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(incident.createdAt))} ago</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{incident.updates[incident.updates.length-1]?.message || 'Investigating...'}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold uppercase">{incident.service}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase">{incident.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="card p-8 text-center text-slate-400 border-dashed">No active incidents to report.</div>}
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Past 7 Days History</h2>
          <div className="card divide-y divide-slate-100 dark:divide-slate-700">
            {data?.resolvedHistory?.length > 0 ? data.resolvedHistory.map(incident => (
              <div key={incident._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4"><CheckCircle2 size={20} className="text-green-500" /><div><p className="font-semibold text-sm">{incident.title}</p><p className="text-xs text-slate-500">{incident.service}</p></div></div>
                <div className="text-right"><p className="text-xs font-medium">{new Date(incident.resolvedAt).toLocaleDateString()}</p><p className="text-[10px] text-slate-400 uppercase">Resolved</p></div>
              </div>
            )) : <div className="p-8 text-center text-slate-400">No incidents in the last 7 days.</div>}
          </div>
        </div>
      </main>
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t text-center text-sm text-slate-500"><p>&copy; 2026 Incident X. Powered by Gemini 2.0 Flash.</p></footer>
    </div>
  );
};

export default PublicStatus;
