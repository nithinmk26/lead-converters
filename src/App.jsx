import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  getLeads, 
  addLead, 
  markLeadCompleted, 
  deleteLead,
  deleteLeadsByStatus,
  deleteMultipleLeads
} from './services/db';

import { isAuthenticated, logoutUser } from './services/auth';
import { LoginLandingPage } from './components/LoginLandingPage';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { NavigationCards } from './components/NavigationCards';
import { LeadTable } from './components/LeadTable';
import { AddLeadModal } from './components/AddLeadModal';
import { SendMessageModal } from './components/SendMessageModal';
import { Toast } from './components/Toast';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('todo');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLeadForMessaging, setSelectedLeadForMessaging] = useState(null);
  const [toast, setToast] = useState(null);

  // Check auth state on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  // Load leads when authenticated
  useEffect(() => {
    if (authenticated) {
      const loaded = getLeads();
      setLeads(loaded);
    }
  }, [authenticated]);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setToast({ message: 'Welcome back! Authentication successful.', type: 'success' });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setToast({ message: 'Logged out successfully.', type: 'success' });
  };

  const handleAddLead = (formData) => {
    const created = addLead(formData);
    setLeads(getLeads());
    setActiveTab('todo');
    setToast({ message: `Lead "${created.name}" added successfully!`, type: 'success' });
  };

  const handleSendComplete = (leadId, brochureTheme) => {
    const updated = markLeadCompleted(leadId, brochureTheme);
    setLeads(updated);
    
    // Trigger festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    setToast({ 
      message: `Brochure (${brochureTheme.toUpperCase()}) published & lead marked as Completed!`, 
      type: 'success' 
    });
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const updated = deleteLead(leadId);
      setLeads(updated);
      setToast({ message: 'Lead deleted from database.', type: 'success' });
    }
  };

  const handleDeleteSectionLeads = (status) => {
    const sectionName = status === 'todo' ? 'To-Do' : 'Completed';
    const updated = deleteLeadsByStatus(status);
    setLeads(updated);
    setToast({ message: `All ${sectionName} leads deleted from database.`, type: 'success' });
  };

  const handleDeleteMultipleLeads = (leadIds) => {
    const updated = deleteMultipleLeads(leadIds);
    setLeads(updated);
    setToast({ message: `${leadIds.length} lead(s) deleted from database.`, type: 'success' });
  };

  const handleLeadsImported = (importedLeads) => {
    setLeads(importedLeads);
    setToast({ message: 'Database backup imported successfully!', type: 'success' });
  };

  const scrollToTable = () => {
    const element = document.getElementById('lead-pipeline');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Login Landing Page if unauthenticated
  if (!authenticated) {
    return (
      <>
        <LoginLandingPage onLoginSuccess={handleLoginSuccess} />
        {toast && (
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  const todoCount = leads.filter((l) => l.status === 'todo').length;
  const completedCount = leads.filter((l) => l.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar 
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onLeadsImported={handleLeadsImported}
        onLogout={handleLogout}
        totalCount={leads.length}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {/* Hero Section Banner */}
        <div className="text-center max-w-3xl mx-auto my-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3-5 py-1-5 rounded-full badge-todo font-extrabold text-xs tracking-widest uppercase font-heading">
            ⚡ MALNAD WEBS DESIGNED PIPELINE
          </div>
          <h2 className="text-4xl md-text-5xl font-black font-heading text-white tracking-tight">
            Lead Converter & <span className="gradient-text">Publishing Hub</span>
          </h2>
          <p className="text-gray-400 text-sm md-text-base leading-relaxed">
            Easily capture customer leads, select customized brochure attachments (Nature, Dark, Colorful), and send pre-constructed WhatsApp messages in one click.
          </p>
        </div>

        {/* Analytics Stats Metrics */}
        <StatsOverview leads={leads} />

        {/* Entry Page Two Division Cards */}
        <NavigationCards 
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onScrollToTable={scrollToTable}
          todoCount={todoCount}
          completedCount={completedCount}
        />

        {/* Main Data Table */}
        <LeadTable 
          leads={leads}
          onOpenSendMessage={(lead) => setSelectedLeadForMessaging(lead)}
          onDeleteLead={handleDeleteLead}
          onDeleteSectionLeads={handleDeleteSectionLeads}
          onDeleteMultipleLeads={handleDeleteMultipleLeads}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-gray-500 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm-flex-row justify-between items-center gap-2">
          <span>Lead Converters &copy; {new Date().getFullYear()} — Built with React & Glassmorphism</span>
          <span className="text-gray-400 font-heading">Inspired by <strong className="text-amber-400">malnadwebs.online</strong></span>
        </div>
      </footer>

      {/* Modals */}
      <AddLeadModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
      />

      <SendMessageModal 
        isOpen={!!selectedLeadForMessaging}
        lead={selectedLeadForMessaging}
        onClose={() => setSelectedLeadForMessaging(null)}
        onSendComplete={handleSendComplete}
        onDeleteLead={handleDeleteLead}
      />

      {/* Toast Feedback */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
