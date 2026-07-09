/** Strips everything but digits and a leading "+" so tel: links always work. */
export function telHref(phone: string): string {
  const cleaned = phone.trim().replace(/[^\d+]/g, "")
  return `tel:${cleaned}`
}

const arabicIndicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]

/** Keeps phone numbers in Western digits and LTR even inside Arabic RTL text. */
export function formatPhoneForDisplay(phone: string): string {
  return phone.replace(/[٠-٩]/g, (d) => String(arabicIndicDigits.indexOf(d)))
}
