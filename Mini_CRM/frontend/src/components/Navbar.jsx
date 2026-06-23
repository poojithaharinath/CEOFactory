import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Layers } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 border-b border-slate-200/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-600/10">
            <Layers className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight block">
              CEOFactory
            </span>
            <span className="text-[10px] block text-slate-500 tracking-wider uppercase font-semibold">
              Opportunity Pipeline
            </span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
              <UserIcon className="h-3.5 w-3.5 text-indigo-600" />
              <div className="text-left leading-none">
                <p className="text-[10px] text-slate-500 font-medium">Signed in as</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{user.name}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-550" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
