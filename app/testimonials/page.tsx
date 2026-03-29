'use client'

import Link from 'next/link'
import { Star, ArrowLeft } from 'lucide-react'

export default function TestimonialsPage() {

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      role: 'Yoga Instructor',
      image: '👩‍🏫',
      quote: 'AyuraHealth helped me understand my Pitta constitution and finally manage my chronic inflammation. The personalized recommendations from both Ayurveda and modern medicine gave me confidence.',
      rating: 5,
    },
    {
      name: 'James Chen',
      location: 'Singapore',
      role: 'Software Engineer',
      image: '👨‍💻',
      quote: 'As someone skeptical of alternative medicine, I was impressed by how AyuraHealth bridges ancient wisdom with modern science. The blood report analysis was eye-opening.',
      rating: 5,
    },
    {
      name: 'Amara Okafor',
      location: 'Lagos, Nigeria',
      role: 'Entrepreneur',
      image: '👩‍💼',
      quote: 'The 7-day diet charts are game-changing. I finally have a practical way to apply Ayurvedic principles to my busy life. Plus, it\'s free!',
      rating: 5,
    },
    {
      name: 'Dr. Hiroshi Tanaka',
      location: 'Tokyo, Japan',
      role: 'Holistic Health Practitioner',
      image: '👨‍⚕️',
      quote: 'As a healthcare professional, I recommend AyuraHealth to all my patients. The integration of multiple healing traditions is unprecedented.',
      rating: 5,
    },
    {
      name: 'Sofia Rodriguez',
      location: 'Mexico City, Mexico',
      role: 'Wellness Coach',
      image: '👩‍🏫',
      quote: 'AyuraHealth is democratizing holistic health. Patients from low-income backgrounds now have access to personalized guidance that was previously only available to the wealthy.',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      location: 'Bangalore, India',
      role: 'Retired Teacher',
      image: '👴',
      quote: 'At 68, I thought my health issues were permanent. AyuraHealth\'s guidance helped me regain energy and vitality. Thank you for making this free for everyone.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-600">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">User Testimonials</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Hear From Our Community</h2>
          <p className="text-xl text-slate-600">
            Real stories from people transforming their health with AyuraHealth
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 mb-6 italic">&quot;{testimonial.quote}&quot;</p>

                {/* Author */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                      <p className="text-xs text-slate-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Health?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users discovering the power of holistic health. Start your journey today&mdash;it&apos;s free forever.
          </p>
          <Link href="/chat">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Start Your Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 AyuraHealth. Healing has always been natural.</p>
        </div>
      </footer>
    </div>
  )
}
