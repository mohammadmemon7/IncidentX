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
  Sparkles,
  Zap,
  Terminal,
  ShieldAlert,
  ArrowRight
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
      toast.success('Communication broadcasted');
    } catch (err) { toast.error('Transmission failed'); }
  };

  const handleResolve = async () => {
    if (window.confirm('Confirm incident resolution? This will lock the current session.')) {
      try {
        await resolveIncident(id).unwrap();
        toast.success('Incident resolution recorded');
      } catch (err) { toast.error('Failed to resolve incident'); }
    }
  };

  const handleSuggestRootCause = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:10001/api'}/incidents/${id}/rootcause`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRootCauses(res.data.suggestions);
      toast.success('AI Forensic analysis complete');
    } catch (err) { toast.error('Failed to analyze root cause'); }
    finally { setIsSuggesting(false); }
  };

  if (isLoading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500 animate-pulse" size={32} />
      </div>
    </div>
  );
  if (!incident) return <div className="text-center p-24 text-slate-500 font-black uppercase tracking-widest">Incident Record Not Found.</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-white/5 relative">
        <div className="flex items-start gap-6">
          <Link to="/incidents" className="mt-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{incident.title}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                incident.severity === 'critical' ? 'border-red-500/20 bg-red-500/10 text-red-500' : 
                incident.severity === 'major' ? 'border-orange-500/20 bg-orange-500/10 text-orange-500' : 
                'border-yellow-500/20 bg-yellow-500/10 text-yellow-500'
              }`}>{incident.severity} PRIORITY</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs font-black text-slate-500 uppercase tracking-[0.15em]">
              <span className="flex items-center gap-2.5"><Activity size={16} className="text-primary-500" /> {incident.service}</span>
              <span className="flex items-center gap-2.5"><Clock size={16} /> {formatDistanceToNow(new Date(incident.createdAt))} AGO</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                 <span>{incident.status}</span>
              </div>
            </div>
          </div>
        </div>
        {incident.status !== 'resolved' && (user.role === 'admin' || user.role === 'responder') && (
          <button 
            onClick={handleResolve} 
            disabled={isResolving} 
            className="h-14 px-8 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest hover:bg-green-500 transition-all flex items-center gap-3 shadow-xl shadow-green-600/10 active:scale-95 disabled:opacity-50"
          >
            {isResolving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} 
            Resolve Incident
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Operations Hub */}
        <div className="lg:col-span-8 space-y-10">
          {incident.status !== 'resolved' && (user.role === 'admin' || user.role === 'responder') && (
            <div className="glass p-8 rounded-[2.5rem] border border-primary-500/20 bg-primary-500/[0.02] relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
              <form onSubmit={handlePostUpdate} className="space-y-6">
                <div className="flex items-center gap-3 mb-2 text-primary-400">
                   <Terminal size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Broadcast Communication</span>
                </div>
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-xl text-white placeholder:text-slate-700 resize-none min-h-[120px] font-medium" 
                  placeholder="Initiate communication pulse..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required 
                />
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="relative group/select">
                    <select 
                      className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none min-w-[200px] cursor-pointer hover:bg-white/10 transition-all" 
                      value={statusChange} 
                      onChange={(e) => setStatusChange(e.target.value)}
                    >
                      <option value="" className="bg-[#020617]">Maintain Status</option>
                      <option value="investigating" className="bg-[#020617]">Investigating</option>
                      <option value="identified" className="bg-[#020617]">Identified</option>
                      <option value="monitoring" className="bg-[#020617]">Monitoring</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className="h-12 px-8 rounded-xl bg-primary-600 text-white font-black uppercase tracking-widest text-xs hover:bg-primary-500 transition-all flex items-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" /> : <Send size={16} />} 
                    Post Update
                  </button>
                </div>
              </form>
            </div>
          )}

          {rootCauses && (
            <div className="glass p-8 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/[0.03] animate-in slide-in-from-top-4 duration-500 group">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                      <Sparkles size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-white tracking-tight">AI Forensic Analysis</h3>
                     <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Probable Root Causes Detected</p>
                   </div>
                </div>
                <button onClick={() => setRootCauses(null)} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Dismiss Insight</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {rootCauses.map((rc, i) => (
                  <div key={i} className="glass p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between hover:bg-white/[0.04] transition-all group/rc">
                    <span className="text-lg font-bold text-slate-200 group-hover/rc:text-purple-400 transition-colors">{rc.cause}</span>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                       <span className="text-xs font-black px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/20">{rc.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                <Activity size={24} className="text-primary-500" />
                Incident Timeline
              </h2>
              <div className="h-px flex-1 mx-8 bg-white/5" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{incident.updates?.length || 0} EVENTS</span>
            </div>
            <Timeline updates={incident.updates} />
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-4 space-y-10">
          <AIActionPanel incident={incident} onRootCauseClick={handleSuggestRootCause} />
          
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Responders</h3>
              <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-slate-500 border border-white/5">{incident.responders?.length || 0} ACTIVE</span>
            </div>
            <div className="space-y-5">
              {incident.responders?.map((r, idx) => (
                <div key={idx} className="flex items-center gap-4 group/resp">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-400 font-black text-lg border border-primary-500/20 group-hover/resp:bg-primary-600 group-hover/resp:text-white transition-all">
                      {r.user?.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#020617] rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate tracking-tight">{r.user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{r.user?.role} operator</p>
                  </div>
                </div>
              ))}
              {incident.status !== 'resolved' && (
                <button className="w-full h-12 rounded-xl border border-dashed border-white/10 text-slate-500 hover:border-primary-500/50 hover:text-primary-400 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
                   <UserPlus size={16} /> Deploy Unit
                </button>
              )}
            </div>
          </div>

          {postmortem && (
            <div className="glass p-8 rounded-[2.5rem] border border-purple-500/30 bg-purple-500/[0.02] relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
               <div className="flex items-center gap-3 text-purple-400 mb-6">
                 <FileText size={24} />
                 <h3 className="text-lg font-black uppercase tracking-tight">Postmortem Ready</h3>
               </div>
               <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 opacity-80 line-clamp-3">
                 {postmortem.content.substring(0, 180)}...
               </p>
               <button 
                onClick={() => setShowPostmortem(true)} 
                className="w-full h-14 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs hover:bg-purple-500 transition-all flex items-center justify-center gap-3 group-hover:scale-[1.02]"
               >
                 Review Intelligence <ArrowRight size={18} />
               </button>
            </div>
          )}

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-950/20">
             <div className="flex items-center gap-3 mb-4 text-slate-500">
                <ShieldAlert size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Security Clearance</span>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
               This session is being recorded for institutional memory. Maintain protocol and ensure all updates are descriptive and timestamped.
             </p>
          </div>
        </div>
      </div>

      {/* Postmortem Modal Overhaul */}
      {showPostmortem && postmortem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(168,85,247,0.15)] relative p-10 md:p-16">
            <button 
              onClick={() => setShowPostmortem(false)} 
              className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
               <ChevronLeft size={24} className="rotate-90" />
            </button>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-[2rem] bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                <Bot size={48} />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Intelligence Briefing</h2>
                <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-xs">Automated Incident Postmortem Analysis</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-purple-400 prose-code:text-primary-400 prose-code:bg-white/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown>{postmortem.editedContent || postmortem.content}</ReactMarkdown>
            </div>
            
            <div className="mt-16 pt-10 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowPostmortem(false)} 
                className="h-14 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                Terminate Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;
