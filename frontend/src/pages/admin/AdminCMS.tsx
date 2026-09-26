import React, { useState } from 'react';
import { Image, Save } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCMS: React.FC = () => {
  const [announcementMsg, setAnnouncementMsg] = useState('✨ Free Express Shipping on Orders Over ₹2,999');
  const [heroTitle, setHeroTitle] = useState('Elegance in Every Thread');
  const [heroSub, setHeroSub] = useState('THE SPRING / SUMMER COLLECTION');
  const [heroDesc, setHeroDesc] = useState('Embrace soft pastels, effortless silhouettes, and ethereal fabrics handcrafted for the modern woman.');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80');

  const { showToast } = useToast();

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.saveAnnouncement({
        id: 1,
        message: announcementMsg,
        linkUrl: '/shop',
        displayOrder: 1,
        isActive: true,
      });
      showToast('Announcement ticker message updated!', 'success');
    } catch (err) {
      showToast('Failed to save announcement.', 'error');
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.saveBanner({
        id: 1,
        title: heroTitle,
        subtitle: heroSub,
        description: heroDesc,
        imageUrl: heroImage,
        buttonText: 'Shop New Arrivals',
        targetUrl: '/shop',
        slideOrder: 1,
        isActive: true,
      });
      showToast('Hero banner slider content updated!', 'success');
    } catch (err) {
      showToast('Failed to save banner.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Homepage Content & CMS</h1>
        <p className="text-xs text-[#6B5B5E]">Configure live announcement bar text and main hero slider content without developer intervention.</p>
      </div>

      {/* Announcement Bar Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2D2325]">Top Announcement Ticker</h3>
        
        <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D2325] mb-1">Ticker Message Text</label>
            <input
              type="text"
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#8C5353] text-white font-bold rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Ticker Announcement
          </button>
        </form>
      </div>

      {/* Hero Banner Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2D2325]">Hero Slider Banner #1</h3>

        <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D2325] mb-1">Banner Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D2325] mb-1">Subtitle Tag</label>
            <input
              type="text"
              value={heroSub}
              onChange={(e) => setHeroSub(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D2325] mb-1">Description Paragraph</label>
            <textarea
              rows={3}
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D2325] mb-1">Background Image URL</label>
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3.5 py-2.5"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#8C5353] text-white font-bold rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Hero Slider Content
          </button>
        </form>
      </div>
    </div>
  );
};
