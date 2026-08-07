import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Leaf,
  Moon,
  Palette,
  UserCheck
} from 'lucide-react';
import { BROCHURES } from '../services/whatsapp';

export const LeadTable = ({ 
  leads, 
  onOpenSendMessage, 
  onDeleteLead, 
  activeTab, 
  setActiveTab 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter leads based on active tab and search query
  const filteredLeads = leads.filter((lead) => {
    const matchesTab = lead.status === activeTab;
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search) ||
      lead.location.toLowerCase().includes(search);

    return matchesTab && matchesSearch;
  });

  const todoCount = leads.filter((l) => l.status === 'todo').length;
  const completedCount = leads.filter((l) => l.status === 'completed').length;

  const renderBrochureBadge = (themeKey) => {
    if (!themeKey) return null;
    const brochure = BROCHURES[themeKey];
    if (!brochure) return null;

    return (
      <span className={`badge badge-${themeKey}`}>
        {themeKey === 'nature' && <Leaf className="w-3 h-3" />}
        {themeKey === 'dark' && <Moon className="w-3 h-3" />}
        {themeKey === 'colorful' && <Palette className="w-3 h-3" />}
        {brochure.title}
      </span>
    );
  };

  return (
    <div id="lead-pipeline" className="glass-panel p-6 my-10 space-y-6">
      {/* Top Header Controls: Tab Switcher & Search Bar */}
      <div className="flex flex-col md-flex-row md-items-center justify-between gap-4 pb-4 border-b">
        
        {/* Top Tab Switcher: To Do vs Completed */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border w-fit">
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-5 py-2-5 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'todo'
                ? 'bg-amber-500 text-slate-950'
                : 'text-gray-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>To Do Leads</span>
            <span className={`px-2 py-0-5 rounded-full text-xs ${
              activeTab === 'todo' ? 'bg-slate-950 text-amber-400' : 'text-gray-300'
            }`}>
              {todoCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2-5 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-emerald-400 text-slate-950'
                : 'text-gray-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
            <span className={`px-2 py-0-5 rounded-full text-xs ${
              activeTab === 'completed' ? 'bg-slate-950 text-emerald-400' : 'text-gray-300'
            }`}>
              {completedCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3-5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, phone, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 text-sm py-2"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-400 text-xs uppercase font-heading tracking-wider">
              <th className="py-3 px-4">Lead Name</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status & Details</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr 
                  key={lead.id}
                  className="border-b hover:bg-slate-900 transition-colors group"
                >
                  {/* Lead Name */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-base font-heading">
                      {lead.name}
                    </div>
                    {lead.notes && (
                      <div className="text-xs text-gray-400 mt-0-5">
                        {lead.notes}
                      </div>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="py-4 px-4">
                    <a 
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center gap-1-5 text-sm text-gray-300 hover:text-amber-400 font-mono"
                    >
                      <Phone className="w-3-5 h-3-5 text-amber-400" />
                      <span>{lead.phone}</span>
                    </a>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1-5 text-sm text-gray-300">
                      <MapPin className="w-3-5 h-3-5 text-emerald-400 flex-shrink-0" />
                      <span>{lead.location}</span>
                    </div>
                    {lead.mapsUrl && (
                      <a 
                        href={lead.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-11px text-amber-400 mt-0-5"
                      >
                        <span>View Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>

                  {/* Status & Details */}
                  <td className="py-4 px-4">
                    {lead.status === 'todo' ? (
                      <div className="flex flex-col gap-1">
                        <span className="badge badge-todo">
                          <Clock className="w-3 h-3" /> To-Do
                        </span>
                        <div className="text-11px text-gray-400">
                          Added {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="badge badge-completed">
                          <CheckCircle2 className="w-3 h-3" /> Sent & Done
                        </span>
                        {renderBrochureBadge(lead.selectedBrochure)}
                        {lead.sentAt && (
                          <div className="text-11px text-gray-400">
                            Sent {new Date(lead.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {lead.status === 'todo' && (
                        <button
                          onClick={() => onOpenSendMessage(lead)}
                          className="btn btn-primary text-xs py-2 px-3-5"
                        >
                          <Send className="w-3-5 h-3-5" />
                          <span>Publish / Send</span>
                        </button>
                      )}

                      {lead.status === 'completed' && (
                        <button
                          onClick={() => onOpenSendMessage(lead)}
                          className="btn btn-secondary text-xs py-2 px-3"
                          title="Resend Brochure"
                        >
                          <Send className="w-3-5 h-3-5 text-emerald-400" />
                          <span>Resend</span>
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="btn btn-secondary text-xs p-2 text-rose-400"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  <div className="max-w-xs mx-auto space-y-3">
                    <UserCheck className="w-10 h-10 mx-auto text-gray-600" />
                    <p className="font-heading font-semibold text-white text-base">
                      No {activeTab === 'todo' ? 'Pending To-Do' : 'Completed'} Leads Found
                    </p>
                    <p className="text-xs text-gray-500">
                      {searchTerm 
                        ? `No results matching "${searchTerm}"` 
                        : activeTab === 'todo' 
                        ? 'All leads have been messaged! Use "Add New Lead" to create a new one.' 
                        : 'No messages have been sent yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
