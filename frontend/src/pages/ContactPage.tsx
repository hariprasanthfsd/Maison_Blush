import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BackButton } from '../components/common/BackButton';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      showToast('Thank you! Your inquiry has been sent to our boutique concierge. 💕', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="py-16 bg-[#FAF5F3] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Navigation */}
        <div>
          <BackButton label="Back to Home" to="/" />
        </div>

        {/* Title */}
        <div className="text-center max-w-xl mx-auto">
          <span className="font-script text-3xl text-[#C49A8B]">We Would Love to Hear from You</span>
          <h1 className="font-serif text-4xl font-bold tracking-wide text-[#2D2325] mt-1">
            Boutique Concierge & Contact
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2D2325]">Atelier Flagship</h3>
            
            <div className="space-y-4 text-xs text-[#4A3E3F]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                <span>45 Rosewood Villa, Hill Road, Bandra West, Mumbai, Maharashtra 400050, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                <span>+91 (022) 8765-4321</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                <span>concierge@maisonblush.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8C5353] flex-shrink-0" />
                <span>Monday - Saturday: 10:00 AM - 8:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2D2325]">Send an Inquiry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Sophia Rose"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Message / Fit Inquiry *</label>
                <textarea
                  rows={5}
                  placeholder="How can our boutique styling concierge assist you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
