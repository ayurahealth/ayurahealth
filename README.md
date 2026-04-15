# AyuraHealth — Ancient Wisdom, Modern AI

AyuraHealth is a personal holistic health companion that combines **Ayurveda, Traditional Chinese Medicine (TCM), and 6 other healing traditions** with modern NVIDIA-powered AI to provide personalized wellness guidance.

![AyuraHealth Logo](./public/favicon.svg)

## 🌟 Key Features

- **Dosha Quiz**: Discover your Ayurvedic mind-body type in minutes.
- **Multilingual Support**: Available in English, Hindi, Japanese, Arabic, and more.
- **8 Healing Traditions**: Integrates Ayurveda, TCM, Tibetan, Unani, Siddha, Homeopathy, Naturopathy, and Western Medicine.
- **Privacy-First**: Health data stays in your browser's local storage.
- **Razorpay Integration**: Seamless premium subscriptions with regional (INR) support.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Rich UI/UX)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Prisma](https://www.prisma.io/) + Supabase
- **Payments**: [Razorpay](https://razorpay.com/)
- **AI**: NVIDIA Nemotron via Groq/OpenRouter
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 22.0.0+ (Mandatory for Capacitor 8 & Native builds)
- A Razorpay account
- A Clerk project
- A Prisma-supported database (Supabase recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ayurahealth/ayurahealth.git
   cd ayurahealth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   # Database
   DATABASE_URL="your_prisma_db_url"

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...

   # Razorpay
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...

   # AI APIs
   GROQ_API_KEY=...
   OPENROUTER_API_KEY=...
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy

AyuraHealth implements industry-standard security practices:
- **Rate Limiting**: Protected API endpoints to prevent abuse.
- **Signature Verification**: HMAC validation for all payment webhooks.
- **Audit Logs**: Regular security and deployment audits.
- **No-Tracking**: No invasive tracking cookies or 3rd party advertising networks.

## 🌐 Deploy on Vercel

The production version is hosted on Vercel. Automatic deployments are enabled via GitHub Actions.

---

© 2026 AyuraHealth · Tokyo, Japan
