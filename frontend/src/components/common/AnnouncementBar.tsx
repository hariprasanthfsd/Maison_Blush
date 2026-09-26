import React, { useState, useEffect } from 'react';
import { AnnouncementBar as AnnouncementType } from '../../types';
import { cmsApi } from '../../services/api';

const DEFAULT_ANNOUNCEMENTS: AnnouncementType[] = [
  { id: 1, message: '✨ Free Express Shipping on Orders Over ₹2,999', linkUrl: '/shop', displayOrder: 1, isActive: true },
  { id: 2, message: '🌸 New Spring Bloom Collection Just Dropped', linkUrl: '/shop?category=dresses', displayOrder: 2, isActive: true },
  { id: 3, message: '💕 Women Owned & Independently Operated', linkUrl: '/about', displayOrder: 3, isActive: true },
  { id: 4, message: '🛍️ Use Code WELCOME10 for 10% Off Your First Order', linkUrl: '/shop', displayOrder: 4, isActive: true },
];

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>(DEFAULT_ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await cmsApi.getAnnouncements();
        if (data && data.length > 0) {
          setAnnouncements(data);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements.length) return null;
  const current = announcements[currentIndex];

  return (
    <div className="bg-[#2D2325] text-[#FAF5F3] py-2 px-4 text-center text-xs tracking-wider uppercase font-medium flex items-center justify-center transition-all duration-500 min-h-[32px]">
      <a href={current.linkUrl || '/shop'} className="hover:text-[#E8C4C0] transition-colors flex items-center gap-2">
        <span>{current.message}</span>
      </a>
    </div>
  );
};
