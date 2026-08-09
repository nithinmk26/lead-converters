<<<<<<< HEAD
import React from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Upload,
  UserPlus
} from 'lucide-react';

export const Navbar = ({ onOpenAddModal, onExportLeads, onLogout, totalCount }) => {
  const handleImportClick = () => {
    alert('Import is disabled with Google Sheets backend. Please restore leads using the Google Sheet or add them through the app.');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="navbar-logo-badge">
            <img 
              src="./malnad_webs_logo.png" 
              alt="Malnad Webs Logo" 
              className="navbar-logo-img"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-heading tracking-tight gradient-text">
                LEAD CONVERTERS
              </h1>
              <span className="badge badge-todo text-10px flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Authenticated
              </span>
            </div>
            <p className="text-11px text-gray-400 hidden sm-block">
              Malnad Webs Authorized Lead Publishing Suite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportLeads}
            className="btn btn-secondary text-xs py-2 px-3 hidden md-flex items-center gap-1-5"
            title="Export lead database as JSON"
          >
            <Lock className="w-3-5 h-3-5 text-amber-400" />
            <span>Export Leads</span>
          </button>

          <button
            onClick={handleImportClick}
            className="btn btn-secondary text-xs py-2 px-3 hidden md-flex items-center gap-1-5"
            title="Import is disabled for Google Sheets backend"
          >
            <Upload className="w-3-5 h-3-5 text-emerald-400" />
            <span>Import Vault</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1-5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>

          <button
            onClick={onLogout}
            className="btn btn-secondary text-xs py-2 px-3 text-rose-400 hover:text-rose-300"
            title="Log out of system"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm-block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
