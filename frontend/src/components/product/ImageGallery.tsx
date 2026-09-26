import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { ProductImage } from '../../types';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    images.length > 0 ? images[0].imageUrl : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
  );
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-[#FAF5F3] rounded-3xl overflow-hidden shadow-soft border border-[#F4E3DF] group">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
          onClick={() => setIsZoomOpen(true)}
        />
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white text-[#2D2325] backdrop-blur-md shadow-md transition-all opacity-0 group-hover:opacity-100"
          title="Zoom image"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.imageUrl)}
              className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#FAF5F3] ${
                selectedImage === img.imageUrl ? 'border-[#8C5353] ring-2 ring-[#E8C4C0]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.imageUrl} alt={productName} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsZoomOpen(false)}>
          <button onClick={() => setIsZoomOpen(false)} className="absolute top-6 right-6 text-white p-2">
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt={productName}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
