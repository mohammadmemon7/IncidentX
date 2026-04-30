import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/slices/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { ShieldCheck, LogIn, Loader2, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/'); }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) { toast.error(err?.data?.message || 'Login failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white mb-4 shadow-xl shadow-primary-500/20"><ShieldCheck size={40} /></div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Incident X</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Smart Incident Response Platform</p>
        </div>
        <div className="card p-8 shadow-2xl shadow-slate-200 dark:shadow-none">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><LogIn size={20} className="text-primary-600" /> Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-medium mb-1.5">Email Address</label><input type="email" className="input" placeholder="admin@demo.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium mb-1.5">Password</label><input type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-3">{isLoading ? <Loader2 className="animate-spin" /> : 'Login'}</button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm text-slate-500">Don't have an account? <Link to="/signup" className="text-primary-600 hover:underline font-medium">Create one for free</Link></div>
        </div>
        <div className="mt-6 text-center"><Link to="/status" className="text-sm text-slate-500 hover:text-primary-600 flex items-center justify-center gap-1"><Activity size={14} /> View Public Status Page</Link></div>
      </div>
    </div>
  );
};

export default Login;
