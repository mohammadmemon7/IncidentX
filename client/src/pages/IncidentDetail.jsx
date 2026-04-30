import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useGetIncidentQuery, 
  useAddUpdateMutation, 
  useResolveIncidentMutation,
  useGetPostmortemQuery,
  useGenerateSummaryMutation,
  useGeneratePostmortemMutation
} from '../store/slices/incidentsApiSlice';
import { useSelector } from 'react-redux';
import { 
  ChevronLeft, 
  Clock, 
  AlertCircle, 
  UserPlus, 
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Activity,
  Bot,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import Timeline from '../components/Incident/Timeline';
import AIActionPanel from '../components/Incident/AIActionPanel';
import useSocket from '../hooks/useSocket';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const IncidentDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: incident, isLoading } = useGetIncidentQuery(id);
  const { data: postmortem } = useGetPostmortemQuery(id, { skip: incident?.status !== 'resolved' });
  const [addUpdate, { isLoading: isUpdating }] = useAddUpdateMutation();
  const [resolveIncident, { isLoading: isResolving }] = useResolveIncidentMutation();

  const [message, setMessage] = useState('');
  const [statusChange, setStatusChange] = useState('');
  const [showPostmortem, setShowPostmortem] = useState(false);
  
  // AI Suggestions state
  const [rootCauses, setRootCauses] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Initialize socket
  useSocket(id);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!message.trim() && !statusChange) return;
    try {
      await addUpdate({ id, data: { message, status: statusChange || undefined } }).unwrap();
      setMessage('');
      setStatusChange('');
      toast.success('Update posted');
    } catch (err) { toast.error('Failed to post update'); }
  };

  const handleResolve = async () => {
    if (window.confirm('Are you sure you want to resolve this incident?')) {
      try {
        await resolveIncident(id).unwrap();
        toast.success('Incident resolved');
      } catch (err) { toast.error('Failed to resolve incident'); }
    }
  };

  const handleSuggestRootCause = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:10000/api'}/incidents/${id}/rootcause`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRootCauses(res.data.suggestions);
      toast.success('AI Analysis complete');
    } catch (err) { toast.error('Failed to suggest root cause'); }
    finally { setIsSuggesting(false); }
  };

  if (isLoading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  if (!incident) return <div className="text-center p-12">Incident not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/incidents" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><ChevronLeft size={24} /></Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{incident.title}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                incident.severity === 'critical' ? 'bg-red-100 text-red-700' : incident.severity === 'major' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{incident.severity}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1"><Activity size={14}/> {incident.service}</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {formatDistanceToNow(new Date(incident.createdAt))} ago</span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-semibold capitalize">{incident.status}</span>
            </div>
          </div>
        </div>
        {incident.status !== 'resolved' && (user.role === 'admin' || user.role === 'responder') && (
          <button onClick={handleResolve} disabled={isResolving} className="btn bg-green-600 text-white hover:bg-green-700">
            {isResolving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} Resolve Incident
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {incident.status !== 'resolved' && (user.role === 'admin' || user.role === 'responder') && (
            <div className="card p-6 border-2 border-primary-100 dark:border-primary-900/30">
              <form onSubmit={handlePostUpdate}>
                <textarea className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg resize-none min-h-[100px]" placeholder="What's happening?" value={message} onChange={(e) => setMessage(e.target.value)} required />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <select className="text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 focus:ring-1 ring-primary-500" value={statusChange} onChange={(e) => setStatusChange(e.target.value)}>
                    <option value="">No status change</option>
                    <option value="investigating">Investigating</option>
                    <option value="identified">Identified</option>
                    <option value="monitoring">Monitoring</option>
                  </select>
                  <button type="submit" disabled={isUpdating} className="btn btn-primary px-6">{isUpdating ? <Loader2 className="animate-spin" /> : <Send size={18} />} Post Update</button>
                </div>
              </form>
            </div>
          )}

          {rootCauses && (
            <div className="card p-6 border-2 border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-purple-700 dark:text-purple-400"><Lightbulb size={20}/> Probable Root Causes</h3>
                <button onClick={() => setRootCauses(null)} className="text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {rootCauses.map((rc, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-purple-100 dark:border-purple-700 flex items-center justify-between">
                    <span className="text-sm font-medium">{rc.cause}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{rc.confidence}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Activity size={20} className="text-primary-600" /> Incident Timeline</h2>
            <Timeline updates={incident.updates} />
          </div>
        </div>

        <div className="space-y-6">
          <AIActionPanel incident={incident} onRootCauseClick={handleSuggestRootCause} />
          <div className="card p-6">
            <h3 className="font-bold flex items-center justify-between mb-4">Responders <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{incident.responders?.length}</span></h3>
            <div className="space-y-4">
              {incident.responders?.map((r, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">{r.user?.name?.charAt(0)}</div>
                  <div><p className="text-sm font-semibold">{r.user?.name}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider">{r.user?.role}</p></div>
                </div>
              ))}
            </div>
          </div>
          {postmortem && (
            <div className="card p-6 border-t-4 border-t-purple-500">
              <div className="flex items-center gap-2 text-purple-600 mb-4"><FileText size={20} /><h3 className="font-bold">Postmortem Ready</h3></div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3">{postmortem.content.substring(0, 150)}...</p>
              <button onClick={() => setShowPostmortem(true)} className="w-full btn bg-purple-600 text-white hover:bg-purple-700">View Full Report</button>
            </div>
          )}
        </div>
      </div>

      {showPostmortem && postmortem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-8">
            <button onClick={() => setShowPostmortem(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronLeft size={24} className="rotate-90" /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-600"><Bot size={32} /></div>
              <div><h2 className="text-3xl font-bold">Incident Postmortem</h2><p className="text-slate-500">AI-generated report with institutional memory</p></div>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none"><ReactMarkdown>{postmortem.editedContent || postmortem.content}</ReactMarkdown></div>
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end"><button onClick={() => setShowPostmortem(false)} className="btn btn-secondary px-8">Close Report</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;
