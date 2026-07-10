import { formatAmount } from "./format"
import type { Lang } from "./i18n"

/** wa.me only accepts digits (country code, no leading + or 0-trunk). */
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "")
}

export function buildWhatsAppReminderMessage(name: string, remainingBalance: number, currencySymbol: string, lang: Lang): string {
  const amount = `${formatAmount(remainingBalance)} ${currencySymbol}`
  return lang === "ar"
    ? `مرحبًا ${name}، هذه رسالة تذكير بأن لديك مبلغ ${amount} متبقٍ. يرجى التواصل معنا لتحديد موعد التسوية. شكرًا لك!`
    : `Hi ${name}, this is a reminder that you have ${amount} remaining on your account. Please get in touch to arrange settlement. Thank you!`
}

export function whatsappHref(phone: string, message: string): string {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`
}
