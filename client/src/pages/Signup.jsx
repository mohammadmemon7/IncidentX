import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../store/slices/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import loginBg from '../assets/login-bg.png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/dashboard'); }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/dashboard');
    } catch (err) { toast.error(err?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#020617] font-sans overflow-hidden">
      {/* Left: Premium Visuals */}
      <div className="lg:w-1/2 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/20 via-[#020617]/80 to-[#020617]" />
        
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight italic">IncidentX</span>
        </div>

        <div className="relative z-20 space-y-8">
          <h1 className="text-6xl font-bold text-white leading-tight tracking-tighter">
            Join the <br />
            Next Generation of <br />
            <span className="text-primary-500">Stability.</span>
          </h1>
          <div className="space-y-4">
             {[
               "AI-powered incident forensics",
               "Automated postmortem generation",
               "Unified team coordination"
             ].map((text, i) => (
               <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 size={16} className="text-primary-500" />
                  <span className="text-sm">{text}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <span>Enterprise Ready</span>
          <div className="w-1 h-1 rounded-full bg-slate-800" />
          <span>ISO 27001 Certified</span>
        </div>
      </div>

      {/* Right: Clean Signup Portal */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight italic">IncidentX</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium text-sm leading-snug">Initialize your professional profile to start managing incidents.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 h-12 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium text-sm" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 h-12 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium text-sm" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 h-12 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium text-sm" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full group h-12 rounded-lg bg-white text-black font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-primary-500 hover:text-white shadow-md mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={18} /></>}
              </span>
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account? <Link to="/login" className="text-white hover:text-primary-400 ml-1 transition-colors underline underline-offset-4 font-bold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
