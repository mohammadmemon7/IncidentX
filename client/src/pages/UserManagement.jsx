import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../store/slices/usersApiSlice';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  Loader2,
  Search,
  ChevronDown,
  Eye,
  Zap,
  Activity,
  MoreVertical,
  Check
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const RoleSelector = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { value: 'admin', label: 'Admin', icon: Shield, desc: 'Full system access' },
    { value: 'responder', label: 'Responder', icon: Zap, desc: 'Incident response ops' },
    { value: 'viewer', label: 'Viewer', icon: Eye, desc: 'Read-only protocol' },
  ];

  const selectedRole = roles.find(r => r.value === currentRole);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all group"
      >
        <selectedRole.icon size={16} className="text-primary-500" />
        <span className="text-sm font-bold text-white tracking-tight">{selectedRole.label}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl bg-opacity-95">
           <div className="p-2 space-y-1">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => {
                    onRoleChange(role.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-4 p-3 rounded-lg transition-all text-left group ${
                    currentRole === role.value ? 'bg-primary-600/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentRole === role.value ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <role.icon size={18} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${currentRole === role.value ? 'text-white' : 'text-slate-300'}`}>{role.label}</span>
                        {currentRole === role.value && <Check size={14} className="text-primary-500" />}
                     </div>
                     <p className="text-xs text-slate-500 mt-0.5">{role.desc}</p>
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading } = useGetUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error('Failed to update user protocol');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Executing user deletion protocol. Confirm?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User protocol terminated');
      } catch (err) {
        toast.error('Deletion protocol failed');
      }
    }
  };

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-black text-primary-500 uppercase tracking-[0.2em]">
             <ShieldCheck size={16} />
             Access Control Protocol
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            User Management
          </h1>
          <p className="text-lg text-slate-400 font-medium">Manage operational permissions and security levels.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-900/40 p-6 rounded-xl border border-white/5 shadow-xl">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search operational units by name or email..." 
            className="w-full bg-white/[0.03] border border-white/10 text-white text-base h-12 pl-14 pr-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest px-4">
           Active Units: <span className="text-white">{filteredUsers?.length || 0}</span>
        </div>
      </div>

      {/* User Table: Redesigned for Premium Theme */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/10">
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Unit Identification</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Protocol Role</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Enrolled</th>
              <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
               [...Array(3)].map((_, i) => (
                 <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-10"><div className="h-12 bg-white/5 rounded-lg" /></td>
                 </tr>
               ))
            ) : filteredUsers?.map((u) => (
              <tr key={u._id} className="hover:bg-white/[0.04] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 font-bold text-lg border border-primary-500/20">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base text-white tracking-tight">{u.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <RoleSelector 
                    currentRole={u.role} 
                    onRoleChange={(newRole) => handleRoleChange(u._id, newRole)} 
                  />
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(u._id)}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Terminate Access"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers?.length === 0 && !isLoading && (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-700">
                <Search size={32} />
             </div>
             <p className="text-base text-slate-500 font-medium">No operational units matching your search hash.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
