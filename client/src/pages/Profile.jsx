import React from 'react';
import { User, Mail, Shield, Calendar, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">User Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account information and preferences</p>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-800">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 border-2 border-indigo-400/40">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> {user.role?.toUpperCase() || 'USER'}
              </span>
            </div>
            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-slate-500" /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Account ID</span>
            <p className="text-sm font-mono text-indigo-300 truncate">{user._id || user.id}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Member Since</span>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'June 2026'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={logout}
            className="px-6 py-3 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-sm font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
