import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../store/slices/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { ShieldCheck, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { if (user) navigate('/'); }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Account created successfully');
      navigate('/');
    } catch (err) { toast.error(err?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white mb-4 shadow-xl shadow-primary-500/20"><ShieldCheck size={40} /></div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Incident X</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start your incident response journey</p>
        </div>
        <div className="card p-8 shadow-2xl shadow-slate-200 dark:shadow-none">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><UserPlus size={20} className="text-primary-600" /> Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" className="input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium mb-1.5">Email Address</label><input type="email" className="input" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><label className="block text-sm font-medium mb-1.5">Password</label><input type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-3 mt-4">{isLoading ? <Loader2 className="animate-spin" /> : 'Register'}</button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
