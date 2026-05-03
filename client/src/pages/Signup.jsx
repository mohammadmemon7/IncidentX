import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../store/slices/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import loginBg from '../assets/login-bg.png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/dashboard'); }, [navigate, user]);

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasLetter && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter your work email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Password too weak: 8+ chars, with letters, numbers & symbols required.');
      return;
    }

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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 px-1">
                  Min. chars, letter, number, special char
                </p>
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

          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 gap-3">
               <button 
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
                  className="flex items-center justify-center gap-3 h-12 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 transition-all text-sm font-bold text-white tracking-tight"
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
          </div>

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
