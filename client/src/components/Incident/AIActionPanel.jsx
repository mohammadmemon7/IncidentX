import { 
  Bot, 
  Sparkles, 
  FileText, 
  Lightbulb, 
  Loader2,
  RefreshCcw,
  BookOpen
} from 'lucide-react';
import { 
  useGenerateSummaryMutation, 
  useGeneratePostmortemMutation 
} from '../../store/slices/incidentsApiSlice';
import toast from 'react-hot-toast';

const AIActionPanel = ({ incident, onRootCauseClick }) => {
  const [generateSummary, { isLoading: isGeneratingSummary }] = useGenerateSummaryMutation();
  const [generatePostmortem, { isLoading: isGeneratingPostmortem }] = useGeneratePostmortemMutation();

  const handleGenerateSummary = async () => {
    try {
      await generateSummary(incident._id).unwrap();
      toast.success('AI Summary updated');
    } catch (err) {
      toast.error('Failed to generate summary');
    }
  };

  const handleGeneratePostmortem = async () => {
    try {
      await generatePostmortem(incident._id).unwrap();
      toast.success('Postmortem generated with institutional memory');
    } catch (err) {
      toast.error('Failed to generate postmortem');
    }
  };

  return (
    <div className="card overflow-hidden border-primary-500/20 shadow-lg shadow-primary-500/5">
      <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-bold text-sm">AI Response Intelligence</h3>
        </div>
        <Sparkles size={16} className="animate-pulse" />
      </div>
      
      <div className="p-4 space-y-4">
        {incident.aiSummary && (
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">Live AI Summary</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "{incident.aiSummary}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {isGeneratingSummary ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
            </div>
            Generate Live Summary
          </button>

          <button 
            onClick={onRootCauseClick}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Lightbulb size={14} />
            </div>
            Suggest Root Cause
          </button>

          <button 
            onClick={handleGeneratePostmortem}
            disabled={isGeneratingPostmortem || incident.status !== 'resolved'}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              {isGeneratingPostmortem ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
            </div>
            Gen Postmortem (Memory Mode)
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
        <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <Bot size={10} /> Gemini 2.0 Flash is analyzing this incident
        </p>
      </div>
    </div>
  );
};

export default AIActionPanel;
