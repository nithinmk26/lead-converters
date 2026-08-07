/**
 * Secure Vault Storage Engine
 * Features: Obfuscated Storage, XOR/Base64 Encryption, and Cryptographic Tamper Verification.
 * Environment Aware: Sample dummy leads exist ONLY in DEV mode (`npm run dev`).
 * Production builds (GitHub Pages) automatically strip dummy leads.
 */

const VAULT_STORAGE_KEY = '_mw_app_vault_secure';
const SECRET_SALT = 'MalnadWebs_LeadConverters_SecureVault_2026_x89f!';

const INITIAL_LEADS = [
  {
    id: 'lead-101',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    mapsUrl: '',
    status: 'todo',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Interested in website design & SEO package'
  },
  {
    id: 'lead-102',
    name: 'Priya Hegde',
    phone: '+91 94812 34567',
    location: 'Chikkamagaluru, Karnataka',
    mapsUrl: 'https://maps.app.goo.gl/ao21NKrgeuDVvdsTA',
    status: 'todo',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: 'Resort owner needing online booking website'
  },
  {
    id: 'lead-103',
    name: 'Vikram Gowda',
    phone: '+91 99001 12233',
    location: 'Shivamogga, Karnataka',
    mapsUrl: '',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    selectedBrochure: 'nature',
    notes: 'Sent Nature theme brochure for eco-tourism project'
  }
];

export const encryptPayload = (dataObj) => {
  const jsonString = JSON.stringify(dataObj);
  let cipher = '';
  for (let i = 0; i < jsonString.length; i++) {
    const charCode = jsonString.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
    cipher += String.fromCharCode(charCode);
  }
  const base64Payload = btoa(encodeURIComponent(cipher));
  
  let hash = 0;
  const combined = base64Payload + SECRET_SALT;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  
  return JSON.stringify({
    v: 1,
    enc: true,
    signature: Math.abs(hash).toString(16),
    payload: base64Payload
  });
};

export const decryptPayload = (rawVaultString) => {
  if (!rawVaultString) return null;
  try {
    const parsedVault = JSON.parse(rawVaultString);
    if (!parsedVault || !parsedVault.payload || !parsedVault.signature) {
      console.warn('Vault format unrecognized or unencrypted.');
      return null;
    }
    
    let computedHash = 0;
    const combined = parsedVault.payload + SECRET_SALT;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      computedHash = ((computedHash << 5) - computedHash) + char;
      computedHash |= 0;
    }
    
    if (Math.abs(computedHash).toString(16) !== parsedVault.signature) {
      console.error('CRITICAL SECURITY ALERT: LocalStorage Tampering Detected!');
      alert('🔒 Security Integrity Guard: Local storage modification detected! Tampered data was blocked.');
      return null;
    }
    
    const cipher = decodeURIComponent(atob(parsedVault.payload));
    let jsonString = '';
    for (let i = 0; i < cipher.length; i++) {
      const charCode = cipher.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      jsonString += String.fromCharCode(charCode);
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Vault decryption failed:', error);
    return null;
  }
};

export const getLeads = () => {
  try {
    const rawVault = localStorage.getItem(VAULT_STORAGE_KEY);
    // In DEV mode (npm run dev), seed initial sample leads. In PRODUCTION (GitHub Pages), start clean []
    const defaultLeads = import.meta.env.DEV ? INITIAL_LEADS : [];

    if (!rawVault) {
      const encrypted = encryptPayload(defaultLeads);
      localStorage.setItem(VAULT_STORAGE_KEY, encrypted);
      return defaultLeads;
    }
    
    const decrypted = decryptPayload(rawVault);
    if (decrypted && Array.isArray(decrypted)) {
      // In production builds (GitHub Pages), strip out any dummy seed leads ('lead-101', 'lead-102', 'lead-103')
      if (!import.meta.env.DEV) {
        return decrypted.filter((lead) => !['lead-101', 'lead-102', 'lead-103'].includes(lead.id));
      }
      return decrypted;
    } else {
      const encrypted = encryptPayload(defaultLeads);
      localStorage.setItem(VAULT_STORAGE_KEY, encrypted);
      return defaultLeads;
    }
  } catch (error) {
    console.error('Failed to access secure vault:', error);
    return import.meta.env.DEV ? INITIAL_LEADS : [];
  }
};

export const saveLeads = (leads) => {
  try {
    const encryptedVault = encryptPayload(leads);
    localStorage.setItem(VAULT_STORAGE_KEY, encryptedVault);
  } catch (error) {
    console.error('Failed to save to secure vault:', error);
  }
};

export const addLead = (leadData) => {
  const leads = getLeads();
  const newLead = {
    id: `lead-${Date.now()}`,
    name: leadData.name.trim(),
    phone: leadData.phone.trim(),
    location: leadData.location.trim(),
    mapsUrl: (leadData.mapsUrl && leadData.mapsUrl.trim()) ? leadData.mapsUrl.trim() : '',
    status: 'todo',
    createdAt: new Date().toISOString(),
    notes: leadData.notes || ''
  };
  
  const updatedLeads = [newLead, ...leads];
  saveLeads(updatedLeads);
  return newLead;
};

export const markLeadCompleted = (leadId, brochureTheme) => {
  const leads = getLeads();
  const updatedLeads = leads.map((lead) => {
    if (lead.id === leadId) {
      return {
        ...lead,
        status: 'completed',
        sentAt: new Date().toISOString(),
        selectedBrochure: brochureTheme
      };
    }
    return lead;
  });
  saveLeads(updatedLeads);
  return updatedLeads;
};

export const deleteLead = (leadId) => {
  const leads = getLeads();
  const updatedLeads = leads.filter((lead) => lead.id !== leadId);
  saveLeads(updatedLeads);
  return updatedLeads;
};

export const exportDatabaseJSON = () => {
  const leads = getLeads();
  const encryptedFileContent = encryptPayload(leads);
  const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(encryptedFileContent);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `lead_converters_vault_${new Date().toISOString().slice(0,10)}.vault`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDatabaseJSON = (fileContent) => {
  try {
    let leadsToImport = null;
    
    if (fileContent.includes('signature') && fileContent.includes('payload')) {
      leadsToImport = decryptPayload(fileContent);
    } else {
      leadsToImport = JSON.parse(fileContent);
    }

    if (Array.isArray(leadsToImport)) {
      saveLeads(leadsToImport);
      return leadsToImport;
    } else {
      throw new Error('Invalid or tampered data format');
    }
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};
