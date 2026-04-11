'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle, BookOpen, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ayurveda')

  // Sample Q&A examples for demo
  const demoExamples = {
    ayurveda: {
      question: "What's an Ayurvedic approach to managing insomnia?",
      answer: {
        overview: "Insomnia in Ayurveda is often linked to Vata imbalance, particularly in the nervous system. A holistic approach addresses sleep quality through diet, lifestyle, and herbal support.",
        sections: [
          {
            title: "Root Causes (Ayurvedic View)",
            content: "Excess Vata dosha disrupts the natural sleep-wake cycle. Common triggers include irregular schedules, mental stress, and stimulating foods."
          },
          {
            title: "Recommended Practices",
            content: "Establish a consistent bedtime routine, practice gentle yoga (Yin poses), use warm sesame oil massage (Abhyanga), and consume warm milk with ashwagandha before bed."
          },
          {
            title: "Dietary Suggestions",
            content: "Favor warm, grounding foods like ghee, dates, and warm milk. Avoid caffeine, heavy meals, and stimulating spices in the evening."
          },
          {
            title: "When to Seek Professional Help",
            content: "If insomnia persists beyond 2 weeks or severely impacts daily function, consult a qualified Ayurvedic practitioner or sleep specialist."
          }
        ],
        sources: ["Charaka Samhita, Sutrasthana 21", "Ashtanga Hridayam, Sutrasthana 7"]
      }
    },
    tcm: {
      question: "How does Traditional Chinese Medicine view seasonal wellness?",
      answer: {
        overview: "TCM emphasizes living in harmony with seasonal changes. Each season corresponds to specific organs and requires tailored practices.",
        sections: [
          {
            title: "Spring (Liver & Gallbladder)",
            content: "Focus on gentle movement, fresh greens, and emotional balance. Avoid excessive stress and heavy foods."
          },
          {
            title: "Summer (Heart & Small Intestine)",
            content: "Embrace activity, eat cooling foods, and maintain joyful emotions. Protect heart health with adequate rest."
          },
          {
            title: "Autumn (Lungs & Large Intestine)",
            content: "Practice breathing exercises, eat moistening foods, and prepare for winter. Support respiratory health."
          },
          {
            title: "Winter (Kidneys & Bladder)",
            content: "Prioritize rest, eat warming foods, and conserve energy. This is the season for deep restoration."
          }
        ],
        sources: ["Huangdi Neijing (Yellow Emperor's Inner Classic)", "Shang Han Lun"]
      }
    }
  }

  const currentDemo = demoExamples[activeTab as keyof typeof demoExamples]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-700">🌿</div>
              <span className="text-xl font-bold text-slate-900">AyuraHealth</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">How it works</a>
              <a href="#safety" className="text-sm text-slate-600 hover:text-slate-900">Safety</a>
              <a href="#faq" className="text-sm text-slate-600 hover:text-slate-900">FAQ</a>
              <Link href="/chat">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Start Chat</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
                  Ancient Wisdom,<br />
                  <span className="text-emerald-600">Modern AI</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Get evidence-aware Ayurvedic, TCM, and integrative medicine guidance. Ask questions, get personalized recommendations, and understand your health from multiple traditions—24/7.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/chat" className="w-full sm:w-auto">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg h-12 px-6 rounded-lg flex items-center justify-center transition-colors">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start a Health Session
                  </button>
                </Link>
                <button className="w-full sm:w-auto text-lg h-12 px-6 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Example Reports
                </button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">8</div>
                  <p className="text-sm text-slate-600">Classical & Modern Databases</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <p className="text-sm text-slate-600">Free & Private</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">3</div>
                  <p className="text-sm text-slate-600">Traditions Covered</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">24/7</div>
                  <p className="text-sm text-slate-600">Always Available</p>
                </div>
              </div>
            </div>

            {/* Right: Hero Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-2xl blur-3xl opacity-30"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-semibold text-slate-900">AyuraHealth AI</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">&quot;What&apos;s an Ayurvedic approach to managing insomnia?&quot;</p>
                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      <p className="text-sm font-semibold text-slate-900">Insomnia in Ayurveda is often linked to Vata imbalance...</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Charaka Samhita</span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Ashtanga Hridayam</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section id="demo" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">See It in Action</h2>
            <p className="text-xl text-slate-600">Choose a tradition and see how AyuraHealth answers real health questions</p>
          </div>

          {/* Demo Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {['ayurveda', 'tcm'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab === 'ayurveda' ? '🌿 Ayurveda' : '☯️ TCM'}
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 mb-4">USER QUESTION</h3>
              <p className="text-lg text-slate-900 font-semibold">{currentDemo.question}</p>
            </div>

            {/* Answer */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-600 mb-4">VAIDYA RESPONSE</h3>
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{currentDemo.answer.overview}</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {currentDemo.answer.sections.slice(0, 2).map((section, idx) => (
                    <div key={idx} className="border-l-2 border-emerald-500 pl-4">
                      <p className="font-semibold text-slate-900 text-sm">{section.title}</p>
                      <p className="text-slate-600 text-sm mt-1">{section.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                  {currentDemo.answer.sources.map((source, idx) => (
                    <span key={idx} className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/chat">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center transition-colors">
                Try Your Own Question
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How VAIDYA Works</h2>
            <p className="text-xl text-slate-600">Combining classical wisdom with modern evidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Replacement */}
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "8 Knowledge Bases",
                description: "Charaka Samhita, Ashtanga Hridayam, Huangdi Neijing, Shang Han Lun, modern clinical research, and more"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Evidence-Aware AI",
                description: "NVIDIA Nemotron processes queries across traditions, cross-references sources, and flags contradictions"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Safety First",
                description: "Every response includes red-flag symptoms, emergency guidance, and when to see a professional"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-emerald-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section id="safety" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Safety & Transparency</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">✅ Educational Only</h3>
                  <p className="text-slate-600">AyuraHealth provides information for educational purposes and is not a substitute for professional medical advice.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">✅ Your Privacy Matters</h3>
                  <p className="text-slate-600">All conversations are private. We never sell data or use your health information for training.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">✅ Transparent Sources</h3>
                  <p className="text-slate-600">Every recommendation includes citations to classical texts and scientific papers you can verify.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">✅ Emergency Protocol</h3>
                  <p className="text-slate-600">If you report emergency symptoms, we immediately recommend contacting emergency services.</p>
                </div>
              </div>
              <Link href="/safety">
                <button className="mt-8 px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 inline-flex items-center text-sm font-medium transition-colors">
                  Read Full Safety Guidelines
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
            <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
              <h3 className="font-bold text-slate-900 mb-4">Appropriate Use Cases</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-emerald-700 mb-1">✓ Good for:</p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Exploring wellness and lifestyle changes</li>
                    <li>• Understanding different medical traditions</li>
                    <li>• Preparing questions for your doctor</li>
                    <li>• Learning about herbal and dietary approaches</li>
                  </ul>
                </div>
                <div className="border-t border-emerald-200 pt-4">
                  <p className="font-semibold text-red-600 mb-1">✗ Not for:</p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Emergency medical situations</li>
                    <li>• Diagnosing serious conditions</li>
                    <li>• Replacing professional medical care</li>
                    <li>• Prescribing medications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Wellness Seekers & Practitioners</h2>
            <p className="text-xl text-slate-600">Real feedback from users across traditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Replacement */}
            {[
              {
                name: "Priya M.",
                role: "Wellness Enthusiast",
                text: "Finally, a tool that respects both Ayurveda and modern science. The citations are incredibly helpful.",
                avatar: "👩‍⚕️"
              },
              {
                name: "Dr. Chen",
                role: "TCM Practitioner",
                text: "I use AyuraHealth to show patients how different traditions approach the same condition. It's a great teaching tool.",
                avatar: "👨‍⚕️"
              },
              {
                name: "Rajesh K.",
                role: "Health Researcher",
                text: "The cross-tradition analysis is unique. No other tool bridges Ayurveda, TCM, and Western medicine like this.",
                avatar: "👨‍🔬"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {/* Card Replacement */}
            {[
              {
                q: "Is AyuraHealth a replacement for my doctor?",
                a: "No. AyuraHealth is an educational tool. Always consult qualified healthcare professionals for diagnosis and treatment."
              },
              {
                q: "How is my data used?",
                a: "Your conversations are private and encrypted. We never sell data, use it for training, or share it with third parties."
              },
              {
                q: "What languages does AyuraHealth support?",
                a: "Currently available in English. Support for Hindi, Sanskrit, Mandarin, and other languages is coming soon."
              },
              {
                q: "Can I download my health sessions?",
                a: "Yes. You can export any session as PDF or save it to your profile for future reference."
              },
              {
                q: "Is there a cost?",
                a: "AyuraHealth is completely free. We're powered by NVIDIA Nemotron and committed to keeping wellness accessible."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <p className="text-slate-700 mb-4">Still have questions?</p>
            <Link href="/contact">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-emerald-100 mb-8">Get wellness insights, new features, and research updates delivered to your inbox.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none"
              required
            />
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </form>
          <p className="text-sm text-emerald-100 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/chat" className="hover:text-white">Chat</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white">How it works</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">© 2026 AyuraHealth. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
