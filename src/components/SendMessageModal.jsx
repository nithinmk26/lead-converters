import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, ExternalLink, Copy, Check, Link, Trash2 } from 'lucide-react';
import { BrochurePreview } from './BrochurePreview';
import { generatePreconstructedMessage, createWhatsAppUrl, BROCHURES } from '../services/whatsapp';

export const SendMessageModal = ({ isOpen, onClose, lead, onSendComplete, onDeleteLead }) => {
  const [selectedTheme, setSelectedTheme] = useState('nature');
  const [driveUrl, setDriveUrl] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (BROCHURES[selectedTheme]) {
      setDriveUrl(BROCHURES[selectedTheme].driveUrl);
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (lead) {
      const generated = generatePreconstructedMessage(lead, selectedTheme, '', driveUrl);
      setMessage(generated);
    }
  }, [lead, selectedTheme, driveUrl]);

  if (!isOpen || !lead) return null;

  const handleSendWhatsApp = async () => {
    setSendError('');
    setIsSending(true);

    try {
      const waUrl = createWhatsAppUrl(lead.phone, message);
      window.open(waUrl, '_blank');

      await onSendComplete(lead.id, selectedTheme);
      onClose();
    } catch (error) {
      setSendError(error?.message || 'Unable to mark lead completed. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDeleteLead) {
      onDeleteLead(lead.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2-5 rounded-xl bg-emerald-400 text-slate-950">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-heading text-white">
                Publish Brochure to WhatsApp
              </h3>
              <p className="text-xs text-gray-400">
                Recipient: <strong className="text-amber-400 font-mono">{lead.phone}</strong> ({lead.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full"
            disabled={isSending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <BrochurePreview 
            selectedTheme={selectedTheme} 
            onSelectTheme={setSelectedTheme} 
          />

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1-5 flex items-center gap-1-5">
              <Link className="w-3-5 h-3-5 text-amber-400" /> Brochure View/Download Drive Link
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/.../view"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="glass-input text-xs font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1-5">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1-5">
                <MessageSquare className="w-3-5 h-3-5 text-amber-400" /> Pre-constructed Message
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3-5 h-3-5" /> : <Copy className="w-3-5 h-3-5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input font-mono text-xs leading-relaxed"
            />
          </div>

          {sendError && (
            <div className="text-rose-400 text-xs">{sendError}</div>
          )}

          <div className="pt-3 flex items-center justify-between border-t gap-3 flex-wrap">
            {onDeleteLead && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger text-xs flex items-center gap-1.5 py-2 px-3"
              >
                <Trash2 className="w-3-5 h-3-5 text-rose-400" />
                <span>Delete Lead</span>
              </button>
            )}

            <div className="flex gap-3 ml-auto items-center">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="btn btn-whatsapp"
                disabled={isSending}
              >
                <>
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending...' : `Send WhatsApp to ${lead.phone}`}</span>
                  <ExternalLink className="w-3-5 h-3-5" />
                </>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
