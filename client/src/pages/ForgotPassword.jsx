import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your recovery email.');
    
    setLoading(true);
    // Simulate recovery protocol
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      toast.success('Recovery protocol initiated.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center p-6 selection:bg-primary-500/30">
      <div className="absolute top-10 left-10">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-2xl tracking-tighter italic">
          <ShieldCheck className="text-primary-500" size={32} />
          IncidentX
        </Link>
      </div>

      <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!isSent ? (
          <>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-500 mx-auto border border-primary-500/20 shadow-lg shadow-primary-500/10">
                 <KeyRound size={32} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Recovery Access</h1>
              <p className="text-slate-400 font-medium">Enter your credentials to initiate a secure reset.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 rounded-2xl bg-white/[0.02] border border-white/5 space-y-8 shadow-2xl">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Registry Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full bg-black/40 border border-white/10 text-white h-14 pl-12 pr-5 rounded-xl focus:ring-2 focus:ring-primary-500/30 outline-none transition-all text-base font-medium placeholder:text-slate-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-500 transition-all active:scale-[0.98] shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Initiate Recovery"}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back to Gateway
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                <CheckCircle2 size={44} />
             </div>
             <div className="space-y-3">
                <h2 className="text-3xl font-bold text-white tracking-tight">Recovery Sent</h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                   If an account exists for <span className="text-white font-bold">{email}</span>, you will receive a reset protocol link shortly.
                </p>
             </div>
             <Link to="/login" className="inline-flex h-12 px-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all items-center gap-2">
                <ArrowLeft size={16} /> Return to Login
             </Link>
          </div>
        )}

        <p className="text-center text-xs font-black text-slate-700 uppercase tracking-[0.3em]">
           INCIDENTX <span className="text-primary-500/50 italic">SECURE ACCESS</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
