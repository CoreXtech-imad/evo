'use client'
import { useState } from 'react'

const faqs = [
  { q: 'How do I receive my digital product?', a: 'After placing your order, you will receive a download link via email (if you provided one) or our team will contact you on WhatsApp to deliver the product directly. Delivery typically happens within minutes to a few hours.' },
  { q: 'What payment methods are accepted?', a: 'We currently accept Cash on Delivery (COD) for Algerian customers and digital payment options. We plan to add more payment methods soon. No credit card required!' },
  { q: 'Can I get a refund if I\'m not satisfied?', a: 'Yes! We offer a satisfaction guarantee. If you\'re not happy with your purchase, contact us within 7 days and we\'ll work to resolve it or offer a refund on a case-by-case basis.' },
  { q: 'How many times can I download my product?', a: 'Each purchase comes with a secure download link that can be used up to 5 times within 48 hours. If you need more downloads, just contact our support team.' },
  { q: 'Are the products updated regularly?', a: 'Yes! Most of our products, especially courses and prompt libraries, receive regular updates at no extra cost. You\'ll have lifetime access to all updates.' },
  { q: 'Do you offer bundles or discounts?', a: 'We frequently run promotions and offer discounts on bundles. Subscribe to our newsletter to be the first to know about deals and new product launches.' },
  { q: 'Is my personal information secure?', a: 'Absolutely. We use industry-standard encryption and never share your personal information with third parties. Your privacy is our top priority.' },
  { q: 'Can I use the products for commercial projects?', a: 'It depends on the product. Each listing clearly states the license type. Most templates and design assets include a commercial license, while courses are for personal use only.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section-gap px-6 md:px-10 bg-surface-container-low">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-label font-bold text-secondary uppercase tracking-widest">FAQ</span>
          <h2 className="font-headline font-black text-4xl md:text-5xl text-on-surface mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? 'bg-surface-container-high' : 'bg-surface-container'}`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-headline font-bold text-sm md:text-base transition-colors ${open === i ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                  {faq.q}
                </span>
                <span className={`material-symbols-outlined text-xl flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-45 text-primary' : 'text-on-surface-variant'}`}>
                  add
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed border-t border-outline-variant/10 pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
