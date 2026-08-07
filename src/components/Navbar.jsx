import React, { useRef } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  LogOut,
  Download, 
  Upload, 
  UserPlus 
} from 'lucide-react';
import { exportDatabaseJSON, importDatabaseJSON } from '../services/db';

export const Navbar = ({ onOpenAddModal, onLeadsImported, onLogout, totalCount }) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const updated = importDatabaseJSON(content);
          onLeadsImported(updated);
        }
      } catch (err) {
        alert('Security Alert: Failed to import file. The file format is unrecognized or corrupted.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
            <Zap className="w-6 h-6 fill-slate-950 text-slate-950" />
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
              Malnad Webs Inspired Lead Publishing Suite
            </p>
          </div>
        </div>

        {/* Action Controls & Encrypted Vault Backup */}
        <div className="flex items-center gap-3">
          {/* Vault Export Button */}
          <button
            onClick={exportDatabaseJSON}
            className="btn btn-secondary text-xs py-2 px-3 hidden md-flex items-center gap-1-5"
            title="Export encrypted vault backup"
          >
            <Lock className="w-3-5 h-3-5 text-amber-400" />
            <span>Export Vault</span>
          </button>

          {/* Vault Import Button */}
          <button
            onClick={handleImportClick}
            className="btn btn-secondary text-xs py-2 px-3 hidden md-flex items-center gap-1-5"
            title="Import & decrypt vault backup"
          >
            <Upload className="w-3-5 h-3-5 text-emerald-400" />
            <span>Import Vault</span>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".vault,.json" 
            className="hidden" 
          />

          {/* Add Lead Primary CTA */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1-5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>

          {/* Logout Button */}
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
