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
import useSocket from '../hooks/useSocket';

const RoleSelector = ({ currentRole, onRoleChange, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);

  const roles = [
    { value: 'admin', label: 'Admin', icon: Shield, desc: 'Full system access', color: 'text-red-500', bg: 'bg-red-500/10' },
    { value: 'responder', label: 'Responder', icon: Zap, desc: 'Incident response ops', color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { value: 'viewer', label: 'Viewer', icon: Eye, desc: 'Read-only protocol', color: 'text-blue-500', bg: 'bg-blue-500/10' },
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
        className="flex items-center justify-between w-40 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary-500/30 hover:bg-white/[0.05] transition-all group"
      >
        <div className="flex items-center gap-3">
          <selectedRole.icon size={16} className={selectedRole.color} />
          <span className="text-sm font-bold text-white tracking-tight">{selectedRole.label}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-3 w-72 bg-[#1e293b] border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,1)] z-[999] overflow-hidden"
        >
          <div className="p-2.5 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Protocol Level</div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleChange(role.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${currentRole === role.value ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentRole === role.value ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                  <role.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${currentRole === role.value ? 'text-white' : 'text-slate-300'} group-hover:text-white transition-colors`}>{role.label}</span>
                    {currentRole === role.value && <Check size={14} className="text-primary-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors truncate">{role.desc}</p>
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
  useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
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

      {/* User List: Responsive Table for Desktop, Cards for Mobile */}
      <div className="space-y-4">
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
            ))
          ) : filteredUsers?.map((u) => (
            <div key={u._id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 font-bold text-lg border border-primary-500/20">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-white tracking-tight truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{u.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Level</span>
                  <div className={`relative ${openDropdownId === u._id ? 'z-[100]' : 'z-10'}`}>
                    <RoleSelector
                      currentRole={u.role}
                      onRoleChange={(newRole) => handleRoleChange(u._id, newRole)}
                      isOpen={openDropdownId === u._id}
                      setIsOpen={(isOpen) => setOpenDropdownId(isOpen ? u._id : null)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrolled Date</span>
                  <span className="text-xs font-bold text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white/[0.02] border border-white/5 rounded-2xl shadow-2xl overflow-visible">
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
                  <td className={`px-8 py-6 relative ${openDropdownId === u._id ? 'z-[100]' : 'z-30'}`}>
                    <RoleSelector
                      currentRole={u.role}
                      onRoleChange={(newRole) => handleRoleChange(u._id, newRole)}
                      isOpen={openDropdownId === u._id}
                      setIsOpen={(isOpen) => setOpenDropdownId(isOpen ? u._id : null)}
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
        </div>

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
