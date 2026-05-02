import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight italic">IncidentX</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/docs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</Link>
          <Link to="/status" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Status Page</Link>
        </div>

        {/* Auth Links */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary h-11 px-6 text-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-white hover:text-primary-500 transition-colors">Sign In</Link>
              <Link to="/signup" className="btn btn-primary h-11 px-6 text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#020617] border-b border-white/5 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/docs" className="text-lg font-medium text-slate-400" onClick={() => setIsOpen(false)}>Documentation</Link>
          <Link to="/status" className="text-lg font-medium text-slate-400" onClick={() => setIsOpen(false)}>Status Page</Link>
          <hr className="border-white/5" />
          <Link to="/login" className="text-lg font-bold text-white" onClick={() => setIsOpen(false)}>Sign In</Link>
          <Link to="/signup" className="btn btn-primary w-full py-4 text-lg" onClick={() => setIsOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
