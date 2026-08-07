/**
 * WhatsApp & Messaging Service
 * Formats numbers and generates WhatsApp web deep links with exact pre-constructed messages and Google Drive brochure links.
 */

export const BROCHURES = {
  nature: {
    id: 'nature',
    title: 'Nature Theme',
    tagline: 'Fresh, Organic & Eco-Friendly Digital Solutions',
    color: '#34d399',
    badge: 'Nature Theme',
    imagePath: '/brochure/nature_theme.jpeg',
    filename: 'nature_theme.jpeg',
    driveUrl: 'https://drive.google.com/file/d/1-VBmGnwxASOj-zK57eZZv1jfZhvTxZoI/view?usp=sharing',
    description: 'Fresh eco-friendly brochure image.'
  },
  dark: {
    id: 'dark',
    title: 'Dark Theme',
    tagline: 'Cinematic, High-End & Premium Glassmorphic Design',
    color: '#c084fc',
    badge: 'Dark Theme',
    imagePath: '/brochure/dark_theme.jpeg',
    filename: 'dark_theme.jpeg',
    driveUrl: 'https://drive.google.com/file/d/1tLi5ElcAPu1z1AB2t1cUU_MgT6mNVxdg/view?usp=sharing',
    description: 'Midnight dark luxury brochure image.'
  },
  colorful: {
    id: 'colorful',
    title: 'Colourful Theme',
    tagline: 'Creative, Bold & Dynamic Visual Experience',
    color: '#fb7185',
    badge: 'Colourful Theme',
    imagePath: '/brochure/colourful_theme.jpeg',
    filename: 'colourful_theme.jpeg',
    driveUrl: 'https://drive.google.com/file/d/1vw1X-rsh0yrJc5yqNuoGjKpcTHS8fP5N/view?usp=sharing',
    description: 'Vibrant colourful brochure image.'
  }
};

export const generatePreconstructedMessage = (lead, brochureThemeKey = 'nature', customNote = '', customDriveUrl = '') => {
  const brochure = BROCHURES[brochureThemeKey] || BROCHURES.nature;
  const brochureLink = (customDriveUrl && customDriveUrl.trim()) ? customDriveUrl.trim() : brochure.driveUrl;

  let msg = `Hello ${lead.name},\n\n`;
  msg += `Thank you for reaching out to us from *${lead.location}*!\n\n`;
  msg += `We are excited to share our official business brochure with you:\n\n`;
  msg += `Brochure:\n${brochureLink}\n\n`;
  msg += `Location:\nhttps://maps.app.goo.gl/ao21NKrgeuDVvdsTA\n\n`;
  msg += `Website:\nhttps://malnadwebs.online\n\n`;
  if (customNote) {
    msg += `Note:\n${customNote}\n\n`;
  }
  msg += `Feel free to reply here if you have any questions or would like to schedule a call!\n\n`;
  msg += `Best regards\n`;
  msg += `Malnad Webs`;

  return msg;
};

export const createWhatsAppUrl = (phone, message) => {
  // Clean phone number (keep numbers only)
  let cleanPhone = phone.replace(/[^0-9]/g, '');

  // Default to India country code 91 if 10 digits
  if (cleanPhone.length === 10) {
    cleanPhone = '+91' + cleanPhone;
  }

  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};

export const downloadBrochureImage = (themeKey) => {
  const brochure = BROCHURES[themeKey] || BROCHURES.nature;
  const link = document.createElement('a');
  link.href = brochure.imagePath;
  link.download = brochure.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
