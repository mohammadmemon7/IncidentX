import { useState } from 'react';
import { X, Loader2, Send, AlertOctagon } from 'lucide-react';
import { useCreateIncidentMutation } from '../../store/slices/incidentsApiSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateIncidentModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [createIncident, { isLoading }] = useCreateIncidentMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'major',
    service: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createIncident(formData).unwrap();
      toast.success('Incident created successfully');
      onClose();
      navigate(`/incidents/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create incident');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-r from-red-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon size={24} />
            <h2 className="text-xl font-bold">Declare New Incident</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Incident Title</label>
            <input 
              className="input" 
              placeholder="e.g. Payment service returning 500s"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Service affected</label>
              <input 
                className="input" 
                placeholder="e.g. auth-service"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Severity</label>
              <select 
                className="input"
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
              >
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Initial Description</label>
            <textarea 
              className="input min-h-[100px] resize-none" 
              placeholder="Briefly describe what's happening..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 btn btn-primary">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Declare Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
