export const CONTACT_PHONE_DISPLAY = '+55 42 9 9915 3814';
export const CONTACT_PHONE_E164 = '5542999153814';

const DEFAULT_WHATSAPP_TEXT = 'Ola, quero falar sobre um projeto de branding';

export function getWhatsAppUrl(message: string = DEFAULT_WHATSAPP_TEXT): string {
  return `https://api.whatsapp.com/send/?phone=${CONTACT_PHONE_E164}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}
