// Simple content safety check
const DANGEROUS_PATTERNS = [
  /suicide|self.harm|overdose|kill myself/i,
  /how to make.*drug|synthesize.*drug/i,
  /replace.*doctor|stop.*medication/i,
]

export function isSafeInput(text: string): boolean {
  return !DANGEROUS_PATTERNS.some(pattern => pattern.test(text))
}

export function getSafetyResponse(lang: string): string {
  const responses: Record<string, string> = {
    en: "I'm concerned about what you've shared. Please reach out to a mental health professional or call a crisis helpline immediately. In Japan: 0120-783-556. In India: iCall 9152987821.",
    ja: "あなたのことが心配です。すぐにメンタルヘルスの専門家や危機相談窓口にご連絡ください。いのちの電話: 0120-783-556",
    hi: "मुझे आपकी चिंता है। कृपया तुरंत किसी मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें। iCall: 9152987821",
  }
  return responses[lang] || responses.en
}
