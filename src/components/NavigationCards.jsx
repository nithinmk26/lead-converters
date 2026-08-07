import React from 'react';
import { UserPlus, Send, ArrowRight, Sparkles } from 'lucide-react';

export const NavigationCards = ({ onOpenAddModal, onScrollToTable, todoCount, completedCount }) => {
  return (
    <div className="grid md-grid-cols-2 gap-6 my-10">
      {/* Division 1: Add Lead */}
      <div 
        onClick={onOpenAddModal}
        className="glass-card-interactive group border-amber-20"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950">
            <UserPlus className="w-7 h-7" />
          </div>
          <span className="badge badge-todo flex items-center gap-1">
            <Sparkles className="w-3-5 h-3-5" /> Quick Entry
          </span>
        </div>

        <h3 className="text-2xl font-extrabold font-heading text-white mb-2">
          Add New Lead
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Record customer name (*), phone number (*), location (*), and Google Maps pin to expand your sales pipeline.
        </p>

        <div className="flex items-center text-amber-400 font-bold text-sm font-heading">
          <span>Fill Lead Form</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>

      {/* Division 2: Publish / Manage Leads */}
      <div 
        onClick={onScrollToTable}
        className="glass-card-interactive group border-emerald-20"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center text-slate-950">
            <Send className="w-7 h-7" />
          </div>
          <div className="flex gap-2">
            <span className="badge badge-todo">
              {todoCount} To-Do
            </span>
            <span className="badge badge-completed">
              {completedCount} Done
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-extrabold font-heading text-white mb-2">
          Publish to Lead
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Select brochure (Nature, Dark, Colorful), preview customized message, and dispatch directly via WhatsApp.
        </p>

        <div className="flex items-center text-emerald-400 font-bold text-sm font-heading">
          <span>Manage Pipeline & Send</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};
