import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchLeads,
  addLead,
  completeLead,
  deleteLead,
  deleteMany,
  clearStatus,
  exportLeadsJSON
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
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const loaded = await fetchLeads();
      setLeads(loaded);
    } catch (error) {
      setToast({
        message: error.message || 'Unable to connect to the lead database. Please try again.',
        type: 'error'
      });
      setLeads([]);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadLeads();
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

  const handleAddLead = async (formData) => {
    setIsProcessingAction(true);
    try {
      const created = await addLead(formData);
      await loadLeads();
      setActiveTab('todo');
      setToast({ message: `Lead "${created.name}" added successfully!`, type: 'success' });
    } catch (error) {
      setToast({
        message: error.message || 'Unable to save lead. Please try again.',
        type: 'error'
      });
      throw error;
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSendComplete = async (leadId, brochureTheme) => {
    setIsProcessingAction(true);
    try {
      const lead = leads.find((item) => item.id === leadId);
      if (!lead) {
        throw new Error('Unable to locate the selected lead.');
      }
      await completeLead(lead, brochureTheme);
      await loadLeads();

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
    } catch (error) {
      setToast({
        message: error.message || 'Unable to update lead. Please try again.',
        type: 'error'
      });
      throw error;
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    setIsProcessingAction(true);
    try {
      await deleteLead(leadId);
      await loadLeads();
      setToast({ message: 'Lead deleted from database.', type: 'success' });
    } catch (error) {
      setToast({
        message: error.message || 'Unable to delete lead. Please try again.',
        type: 'error'
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteSectionLeads = async (status) => {
    const sectionName = status === 'todo' ? 'To-Do' : 'Completed';

    setIsProcessingAction(true);
    try {
      await clearStatus(status);
      await loadLeads();
      setToast({ message: `All ${sectionName} leads deleted from database.`, type: 'success' });
    } catch (error) {
      setToast({
        message: error.message || `Unable to delete ${sectionName} leads. Please try again.`,
        type: 'error'
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeleteMultipleLeads = async (leadIds) => {
    if (!Array.isArray(leadIds) || leadIds.length === 0) return;

    setIsProcessingAction(true);
    try {
      await deleteMany(leadIds);
      await loadLeads();
      setToast({ message: `${leadIds.length} lead(s) deleted from database.`, type: 'success' });
    } catch (error) {
      setToast({
        message: error.message || 'Unable to delete selected leads. Please try again.',
        type: 'error'
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const scrollToTable = () => {
    const element = document.getElementById('lead-pipeline');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportLeads={() => exportLeadsJSON(leads)}
        onLogout={handleLogout}
        totalCount={leads.length}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
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

        {isLoadingLeads && (
          <div className="rounded-2xl border border-amber-500/30 bg-slate-950/70 p-4 text-sm text-amber-200 mb-6">
            Loading leads from the central database...
          </div>
        )}

        <StatsOverview leads={leads} />

        <NavigationCards
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onScrollToTable={scrollToTable}
          todoCount={todoCount}
          completedCount={completedCount}
        />

        <LeadTable
          leads={leads}
          onOpenSendMessage={(lead) => setSelectedLeadForMessaging(lead)}
          onDeleteLead={handleDeleteLead}
          onDeleteSectionLeads={handleDeleteSectionLeads}
          onDeleteMultipleLeads={handleDeleteMultipleLeads}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isProcessing={isProcessingAction}
        />
      </main>

      <footer className="border-t py-6 text-center text-xs text-gray-500 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm-flex-row justify-between items-center gap-2">
          <span>Lead Converters &copy; {new Date().getFullYear()} — Built with React & Glassmorphism</span>
          <span className="text-gray-400 font-heading">Inspired by <strong className="text-amber-400">malnadwebs.online</strong></span>
        </div>
      </footer>

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
