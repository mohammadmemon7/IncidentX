import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/slices/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { ShieldCheck, ArrowRight, Loader2, Globe, Activity, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    const userData = urlParams.get('user');
    const error = urlParams.get('error');

    if (authSuccess && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        dispatch(setCredentials(user));
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to parse user data');
      }
    }

    if (error) {
      toast.error(error);
    }

    // Clear URL parameters to prevent duplicate toasts on re-renders
    if (authSuccess || error) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (user) navigate('/dashboard');
  }, [navigate, user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/dashboard');
    } catch (err) { toast.error(err?.data?.message || 'Login failed'); }
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

        <div className="relative z-20 space-y-6">
          <h1 className="text-6xl font-bold text-white leading-tight tracking-tighter">
            Smart Response <br />
            for <span className="text-primary-500">Modern Teams.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed">
            The professional command center for tracking, managing, and resolving infrastructure incidents.
          </p>
        </div>

        <div className="relative z-20 flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <span>Trusted by Engineering Units</span>
          <div className="w-1 h-1 rounded-full bg-slate-800" />
          <span>v2.4.0 Live</span>
        </div>
      </div>

      {/* Right: Clean Login Portal */}
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
            <h2 className="text-3xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-slate-500 font-medium text-sm leading-snug">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
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
                <div className="flex items-center justify-between ml-1">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                   <Link to="/forgot-password" size="sm" className="text-xs font-black text-primary-500 hover:text-white transition-colors uppercase tracking-widest">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 h-12 px-5 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-medium text-sm" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full group h-12 rounded-lg bg-white text-black font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-primary-500 hover:text-white shadow-md"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : <>Login to Dashboard <ArrowRight size={18} /></>}
              </span>
            </button>
          </form>

          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-3">
               <button 
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`.replace('/api/api', '/api')}
                  className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/3 hover:bg-white/10 transition-all text-sm font-bold text-white tracking-tight"
               >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.86 2.22c1.67-1.54 2.63-3.81 2.63-6.57z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.86-2.22c-.8.53-1.82.85-3.1.85-2.39 0-4.41-1.61-5.14-3.77L.95 13.34C2.43 16.27 5.48 18 9 18z" fill="#34A853"/>
                    <path d="M3.86 10.68c-.19-.53-.3-1.1-.3-1.68s.11-1.15.3-1.68L.95 4.66C.34 5.87 0 7.24 0 9s.34 3.13.95 4.34l2.91-2.66z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.47C13.47.93 11.43 0 9 0 5.48 0 2.43 1.73.95 4.66l2.91 2.66C4.59 5.19 6.61 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
               </button>
            </div>

            <p className="text-center text-slate-500 text-sm font-medium">
              New here? <Link to="/signup" className="text-white hover:text-primary-400 ml-1 transition-colors underline underline-offset-4 font-bold">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
