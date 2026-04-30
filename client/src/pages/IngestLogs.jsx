import { useState } from 'react';
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
  Play
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const IngestLogItem = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card overflow-hidden transition-all">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${
            log.aiDecision?.is_incident ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
          }`}>
            <Activity size={18} />
          </div>
          <div>
            <p className="font-semibold text-sm">{log.service}</p>
            <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(log.createdAt))} ago</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {log.aiDecision?.is_incident ? (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                <AlertCircle size={14} /> Incident Created
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                <CheckCircle2 size={14} /> Ignored
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ingest Payload</h4>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Is Incident:</span>
                  <span className={`text-sm font-bold ${log.aiDecision?.is_incident ? 'text-red-500' : 'text-slate-500'}`}>
                    {log.aiDecision?.is_incident ? 'YES' : 'NO'}
                  </span>
                </div>
                {log.aiDecision?.is_incident && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Proposed Title:</span>
                      <span className="text-sm font-medium">{log.aiDecision?.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Severity:</span>
                      <span className="text-sm font-bold uppercase">{log.aiDecision?.severity}</span>
                    </div>
                    <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Probable Cause</p>
                      <p className="text-sm italic">"{log.aiDecision?.probable_cause}"</p>
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

  // Demo Widget State
  const [demoPayload, setDemoPayload] = useState({
    service: 'payment-gateway',
    log_level: 'ERROR',
    message: 'Connection timeout to db-primary after 30s',
    metadata: { host: 'prod-db-01', error_code: 'ETIMEOUT' }
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:10000/api'}/ingest/logs`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLogs(res.data);
    } catch (err) {
      toast.error('Failed to fetch ingest logs');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchLogs();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:10000/api'}/ingest`, demoPayload);
      toast.success('Simulation payload sent!');
      fetchLogs();
    } catch (err) {
      toast.error('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Ingest Engine</h1>
          <p className="text-slate-500 mt-1">Real-time log ingestion and AI auto-detection pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logs List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Terminal size={20} className="text-primary-600" />
            Ingest History
          </h2>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map(log => <IngestLogItem key={log._id} log={log} />)}
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-500">
              No logs ingested yet.
            </div>
          )}
        </div>

        {/* Demo Widget */}
        <div className="space-y-6">
          <div className="card p-6 border-2 border-primary-500/20 bg-primary-500/5">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary-700 dark:text-primary-400">
              <Play size={20} />
              Simulate Ingest
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Use this tool to simulate a service log entry and test the AI auto-detection pipeline.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service</label>
                <input 
                  className="input text-sm" 
                  value={demoPayload.service}
                  onChange={(e) => setDemoPayload({...demoPayload, service: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Log Message</label>
                <textarea 
                  className="input text-sm min-h-[80px] resize-none" 
                  value={demoPayload.message}
                  onChange={(e) => setDemoPayload({...demoPayload, message: e.target.value})}
                />
              </div>
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full btn btn-primary mt-2"
              >
                {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                Send Simulation Log
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-primary-500" />
              How it works
            </h3>
            <ul className="text-xs space-y-3 text-slate-500 leading-relaxed">
              <li>1. Service sends POST to <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/api/ingest</code></li>
              <li>2. Gemini 2.0 Flash analyzes the log context in real-time.</li>
              <li>3. AI determines if the error warrants a production incident.</li>
              <li>4. If YES, incident is auto-created and team is notified instantly.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestLogs;
