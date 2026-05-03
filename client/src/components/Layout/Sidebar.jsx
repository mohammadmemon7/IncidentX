import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  Activity, 
  LogOut,
  Database
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Incidents', icon: <AlertCircle size={18} />, path: '/incidents' },
    { name: 'Monitors', icon: <Activity size={18} />, path: '/monitors' },
    { name: 'Status Page', icon: <Activity size={18} />, path: '/status' },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { name: 'Manage Users', icon: <Users size={18} />, path: '/admin/users' },
      { name: 'Data Source', icon: <Database size={18} />, path: '/admin/ingest' }
    );
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-40 border-r border-white/5 bg-[#0b1120] flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="italic">IncidentX</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-primary-600/10 text-primary-400 border border-primary-500/10' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span className="font-bold text-sm tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 font-bold text-xs">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.role}</span>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
