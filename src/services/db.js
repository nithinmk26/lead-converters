export const GOOGLE_SHEETS_API =
  'https://script.google.com/macros/s/AKfycbzU-0lAtMc65opj2TkZKyASfgzyQXnd6rDjWwgmSCbkFY6XVghRm6xou9kNfLZ4tZ8pEA/exec';

const parseJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response received from lead database.');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON response from lead database.');
  }
};

const request = async (payload) => {
  let response;

  try {
    response = await fetch(GOOGLE_SHEETS_API, payload ? {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(payload)
    } : {
      method: 'GET'
    });
  } catch (error) {
    throw new Error('Unable to connect to the lead database. Please check your internet connection.');
  }

  if (!response.ok) {
    throw new Error(`Lead database request failed (${response.status}).`);
  }

  const data = await parseJsonResponse(response);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response from lead database.');
  }

  if (!data.success) {
    throw new Error(data.error || 'Lead database request failed.');
  }

  return data;
};

export const fetchLeads = async () => {
  const data = await request();
  return Array.isArray(data.leads) ? data.leads : [];
};

export const addLead = async (leadData) => {
  const newLead = {
    id: `lead-${Date.now()}`,
    name: leadData.name.trim(),
    phone: leadData.phone.trim(),
    location: leadData.location.trim(),
    mapsUrl: leadData.mapsUrl?.trim() || '',
    status: 'todo',
    createdAt: new Date().toISOString(),
    notes: leadData.notes?.trim() || '',
    sentAt: '',
    selectedBrochure: ''
  };

  await request({
    action: 'add',
    lead: newLead
  });

  return newLead;
};

export const completeLead = async (lead, brochureTheme) => {
  const updatedLead = {
    ...lead,
    status: 'completed',
    sentAt: new Date().toISOString(),
    selectedBrochure: brochureTheme
  };

  await request({
    action: 'update',
    lead: updatedLead
  });

  return updatedLead;
};

export const deleteLead = async (leadId) => {
  await request({
    action: 'delete',
    id: leadId
  });
};

export const deleteMany = async (ids) => {
  if (!Array.isArray(ids)) {
    throw new Error('Invalid deleteMany payload. Expected an array of IDs.');
  }

  await request({
    action: 'deleteMany',
    ids
  });
};

export const clearStatus = async (status) => {
  await request({
    action: 'clearStatus',
    status
  });
};

export const exportLeadsJSON = (leads) => {
  const jsonPayload = JSON.stringify(leads || [], null, 2);
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(jsonPayload)}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `lead_converters_leads_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
