import { formatDistanceToNow } from 'date-fns';
import { Bot, User, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TimelineItem = ({ update, isLast }) => {
  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
      )}
      
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${
        update.isAI ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600'
      }`}>
        {update.isAI ? <Bot size={16} /> : <MessageSquare size={16} />}
      </div>

      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{update.isAI ? 'Incident X AI' : update.createdBy?.name}</span>
            {update.status && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                Changed status to {update.status}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(update.timestamp || Date.now()))} ago
          </span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
          <ReactMarkdown>{update.message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const Timeline = ({ updates = [] }) => {
  if (updates.length === 0) return <div className="text-center p-8 text-slate-400 italic">No updates yet.</div>;

  return (
    <div className="flex flex-col">
      {[...updates].reverse().map((update, index) => (
        <TimelineItem 
          key={index} 
          update={update} 
          isLast={index === updates.length - 1} 
        />
      ))}
    </div>
  );
};

export default Timeline;
