import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  Search, 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Play,
  Clock,
  Database,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const IngestLogItem = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden transition-all hover:bg-white/[0.04]">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-lg ${
            log.aiDecision?.is_incident ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'
          }`}>
            <Activity size={20} />
          </div>
          <div>
            <p className="font-bold text-base text-white tracking-tight">{log.service}</p>
            <p className="text-xs text-slate-500 font-medium">{formatDistanceToNow(new Date(log.createdAt))} ago</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-3">
            {log.aiDecision?.is_incident ? (
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500">
                <AlertCircle size={14} /> Incident Declared
              </span>
            ) : (
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600">
                <CheckCircle2 size={14} /> Analyzed & Ignored
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-8 bg-slate-900/30 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Terminal size={14} /> Ingest Payload
              </h4>
              <pre className="bg-black/40 border border-white/5 text-primary-400 p-6 rounded-xl text-sm overflow-x-auto leading-relaxed shadow-inner">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Cpu size={14} /> AI Decision Protocol
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-sm font-bold text-slate-400">Incident Detection:</span>
                  <span className={`text-sm font-black uppercase tracking-widest ${log.aiDecision?.is_incident ? 'text-red-500' : 'text-slate-500'}`}>
                    {log.aiDecision?.is_incident ? 'POSITIVE' : 'NEGATIVE'}
                  </span>
                </div>
                {log.aiDecision?.is_incident && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-sm font-bold text-slate-400">Proposed Title:</span>
                      <span className="text-sm font-bold text-white">{log.aiDecision?.title}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-sm font-bold text-slate-400">Priority Level:</span>
                      <span className="text-sm font-black uppercase tracking-widest text-white">{log.aiDecision?.severity}</span>
                    </div>
                    <div className="p-5 bg-primary-600/5 rounded-xl border border-primary-500/20 shadow-lg">
                      <p className="text-xs font-black text-primary-500 uppercase tracking-widest mb-2">Probable Cause Analysis</p>
                      <p className="text-sm text-slate-300 italic leading-relaxed">"{log.aiDecision?.probable_cause}"</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IngestLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  const [demoPayload, setDemoPayload] = useState({
    service: 'payment-gateway',
    log_level: 'ERROR',
    message: 'Connection timeout to db-primary after 30s',
    metadata: { host: 'prod-db-01', error_code: 'ETIMEOUT' }
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/ingest/logs`.replace('/api/api', '/api'), {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLogs(res.data);
    } catch (err) {
      toast.error('Failed to fetch ingest logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/ingest`.replace('/api/api', '/api'), demoPayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Simulation payload sent!');
      fetchLogs();
    } catch (err) {
      toast.error('Simulation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto pb-24">
      {/* Header: AI Command */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-black text-primary-500 uppercase tracking-[0.2em]">
             <ShieldAlert size={16} className="animate-pulse" />
             AI Operations Protocol
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Ingest Engine
          </h1>
          <p className="text-lg text-slate-400 font-medium">Real-time log forensics and auto-incident detection pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Logs Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
               Ingest Stream <div className="w-2 h-2 rounded-full bg-primary-500" />
            </h2>
            <button onClick={fetchLogs} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Refresh Protocol</button>
          </div>

          {loading ? (
            <div className="space-y-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="h-24 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
               ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="grid gap-4">
              {logs.map(log => <IngestLogItem key={log._id} log={log} />)}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-white/10 p-24 rounded-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-700">
                 <Terminal size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">No Ingest History</h3>
                <p className="text-base text-slate-400 max-w-sm mx-auto">No operational logs have been ingested into the protocol yet.</p>
              </div>
            </div>
          )}
        </div>

        {/* Control & Simulation Panel */}
        <div className="lg:col-span-4 space-y-10">
          <div className="p-8 rounded-xl bg-primary-600/5 border-2 border-primary-500/20 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <Play size={20} className="text-primary-500" />
                  Simulate Stream
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Trigger the AI auto-detection pipeline by simulating a service log payload.
                </p>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Service Identifier</label>
                  <input 
                    className="w-full bg-black/40 border border-white/10 text-white h-11 px-4 rounded-lg focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-sm font-medium" 
                    value={demoPayload.service}
                    onChange={(e) => setDemoPayload({...demoPayload, service: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Log Forensic Data</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-lg focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-sm font-medium min-h-[100px] resize-none" 
                    value={demoPayload.message}
                    onChange={(e) => setDemoPayload({...demoPayload, message: e.target.value})}
                  />
                </div>
                <button 
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full h-12 rounded-lg bg-primary-600 text-white font-bold text-sm hover:bg-primary-500 transition-all active:scale-95 shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3"
                >
                  {isSimulating ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                  Execute Stream Simulation
                </button>
              </div>
            </div>
            <Activity size={160} className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity" />
          </div>

          {/* Logic Summary */}
          <div className="p-8 rounded-xl bg-white/[0.02] border border-white/5 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Database size={16} className="text-primary-500" />
              Ingest Protocol
            </h3>
            <ul className="space-y-5 text-sm text-slate-400 font-medium leading-relaxed">
              <li className="flex gap-4">
                 <span className="text-primary-500 font-black">01.</span>
                 <span>Gemini 2.0 Flash intercepts operational logs in real-time.</span>
              </li>
              <li className="flex gap-4">
                 <span className="text-primary-500 font-black">02.</span>
                 <span>AI executes deep context analysis to identify failure patterns.</span>
              </li>
              <li className="flex gap-4">
                 <span className="text-primary-500 font-black">03.</span>
                 <span>Automatic incident declaration and responder mobilization.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestLogs;
