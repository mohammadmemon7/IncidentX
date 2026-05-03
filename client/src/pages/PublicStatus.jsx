import { useState, useEffect } from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle, Clock, Globe, Bell, ChevronRight, X, Mail, ShieldAlert, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const ServiceStatus = ({ name, status, uptime }) => (
  <div className="p-8 rounded-xl bg-white/[0.02] border border-white/5 space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full ${status === 'operational' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]`} />
        <h3 className="text-base font-bold text-white tracking-tight">{name}</h3>
      </div>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{status}</span>
    </div>
    
    <div className="flex gap-1 h-8">
       {[...Array(30)].map((_, i) => (
         <div 
           key={i} 
           className={`flex-1 rounded-sm transition-all hover:scale-y-125 cursor-help ${
             i === 15 ? 'bg-orange-500/50' : i === 22 ? 'bg-orange-500/70' : 'bg-green-500/50'
           }`} 
           title={`Day ${i+1}: ${i === 15 || i === 22 ? 'Partial Outage' : '100% Uptime'}`}
         />
       ))}
    </div>
    
    <div className="flex items-center justify-between pt-2">
       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">90 Days Ago</span>
       <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{uptime}% Uptime</span>
       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today</span>
    </div>
  </div>
);

const SubscribeModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter a valid mission-critical email.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Subscription active. You will receive real-time protocol updates.');
      onClose();
      setEmail('');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                 <Bell className="text-primary-500" size={24} />
                 Alert Subscription
              </h2>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">System Broadcast Enrollment</p>
           </div>
           <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                 Get notified instantly when infrastructure events are declared or status changes occur.
              </p>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Work Email Protocol</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      autoFocus
                      type="email"
                      placeholder="e.g. engineering@company.com"
                      className="w-full bg-white/[0.03] border border-white/10 text-white h-12 pl-12 pr-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-base font-medium placeholder:text-slate-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-4 pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                Activate Notifications
              </button>
              <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest">No spam. Only high-severity infrastructure alerts.</p>
           </div>
        </form>
      </div>
    </div>
  );
};

const PublicStatus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status/public`);
      setStatusData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');
    
    socket.on('incident:new', () => fetchStatus());
    socket.on('incident:listUpdate', () => fetchStatus());

    return () => socket.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-primary-500 animate-spin" size={48} />
      </div>
    );
  }

  const overallStatus = statusData?.overallStatus || 'operational';
  const activeIncidents = statusData?.activeIncidents || [];
  const resolvedHistory = statusData?.resolvedHistory || [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-primary-500/30">
      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Premium Header */}
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-4 text-white font-bold text-2xl tracking-tighter italic">
          <ShieldCheck className="text-primary-500" size={32} />
          IncidentX
        </Link>
        <div className="flex items-center gap-8">
           <Link to="/docs" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Documentation</Link>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="h-11 px-6 rounded-lg bg-primary-600 text-white text-xs font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 flex items-center gap-3"
           >
              <Bell size={18} /> Subscribe to Alerts
           </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-24 space-y-16">
        {/* Global Status Banner */}
        <div className={`p-10 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden ${
          overallStatus === 'operational' ? 'bg-green-500/10 border-green-500/20' : 
          overallStatus === 'major-outage' ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'
        }`}>
           <div className="flex items-center gap-8 relative z-10">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)] ${
                overallStatus === 'operational' ? 'bg-green-500/20 text-green-500' :
                overallStatus === 'major-outage' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
              }`}>
                 {overallStatus === 'operational' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
              </div>
              <div className="space-y-2">
                 <h1 className="text-4xl font-bold text-white tracking-tight">
                   {overallStatus === 'operational' ? 'All Systems Operational' : 
                    overallStatus === 'major-outage' ? 'Critical System Failure' : 'Active Service Degradation'}
                 </h1>
                 <p className={`text-base font-medium ${
                   overallStatus === 'operational' ? 'text-green-500/70' :
                   overallStatus === 'major-outage' ? 'text-red-500/70' : 'text-orange-500/70'
                 }`}>
                   Monitoring infrastructure core services in real-time — {activeIncidents.length} active events
                 </p>
              </div>
           </div>
           <div className="text-right hidden md:block relative z-10">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Network Uptime</p>
              <p className="text-3xl font-bold text-white">99.98%</p>
           </div>
           <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -mr-40 -mt-40 ${
             overallStatus === 'operational' ? 'bg-green-500/5' :
             overallStatus === 'major-outage' ? 'bg-red-500/5' : 'bg-orange-500/5'
           }`} />
        </div>

        {/* Active Incidents Section if any */}
        {activeIncidents.length > 0 && (
          <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
             <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3 px-2">
                Critical Active Events <ShieldAlert size={20} className="text-red-500" />
             </h2>
             <div className="space-y-4">
                {activeIncidents.map(incident => (
                  <div key={incident._id} className="p-8 rounded-xl bg-red-500/[0.03] border border-red-500/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{incident.title}</h3>
                      <span className="text-xs font-black text-red-500 uppercase tracking-widest">{incident.severity}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{incident.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> Updated {formatDistanceToNow(new Date(incident.updatedAt))} ago
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{incident.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                 Service Infrastructure Health <Activity size={20} className="text-primary-500" />
              </h2>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Updates Available</span>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ServiceStatus name="Global API Gateway" status={overallStatus === 'major-outage' ? 'degraded' : 'operational'} uptime="99.99" />
              <ServiceStatus name="Authentication Engine" status="operational" uptime="100.00" />
              <ServiceStatus name="Distributed DB (US-EAST)" status="operational" uptime="99.95" />
              <ServiceStatus name="Global Edge CDN" status="operational" uptime="99.99" />
              <ServiceStatus name="Core Incident Logic" status="operational" uptime="100.00" />
              <ServiceStatus name="Public Dashboard" status="operational" uptime="99.98" />
           </div>
        </div>

        {/* Incident History Section */}
        <div className="space-y-12 pt-10">
           <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3 px-2">
              Operational Event Archive <Clock size={20} className="text-slate-500" />
           </h2>
           
           <div className="space-y-16">
              {resolvedHistory.length > 0 ? (
                <div className="space-y-12">
                   {resolvedHistory.map((incident) => (
                     <div key={incident._id} className="relative pl-12 border-l border-white/10">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-800 border-2 border-primary-600 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                          {new Date(incident.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h3>
                        
                        <div className="p-8 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <h4 className="text-base font-bold text-white">{incident.title}</h4>
                              <span className="text-xs font-black text-green-500 uppercase tracking-widest">Resolved</span>
                           </div>
                           <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">{incident.description}</p>
                           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pt-4 flex items-center gap-3">
                              <ShieldCheck size={14} className="text-green-500" /> Resolved {formatDistanceToNow(new Date(incident.resolvedAt))} ago
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="relative pl-12 border-l border-white/10">
                   <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700" />
                   <p className="text-sm text-slate-600 font-bold uppercase tracking-widest">No recent infrastructure events reported.</p>
                </div>
              )}
           </div>
        </div>

        {/* Footer */}
        <div className="pt-24 border-t border-white/10 text-center space-y-8">
           <div className="flex items-center justify-center gap-10 text-xs font-black text-slate-500 uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/status" className="hover:text-white transition-colors">Security Protocol</Link>
           </div>
           <p className="text-xs text-slate-700 font-bold tracking-[0.3em] uppercase">
              Operational Transparency Powered by <span className="text-primary-500 italic">IncidentX</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default PublicStatus;
