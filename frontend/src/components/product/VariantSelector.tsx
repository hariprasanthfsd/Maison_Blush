import React from 'react';
import { ProductVariant } from '../../types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selectedVariant, onSelectVariant }) => {
  if (!variants || variants.length === 0) return null;

  // Extract unique sizes & colors
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(
    new Map(variants.map((v) => [v.colorName, { name: v.colorName, hex: v.colorHex }])).values()
  );

  const selectedSize = selectedVariant?.size || sizes[0];
  const selectedColor = selectedVariant?.colorName || colors[0]?.name;

  const handleSizeChange = (size: string) => {
    const match = variants.find((v) => v.size === size && v.colorName === selectedColor) ||
                  variants.find((v) => v.size === size);
    if (match) onSelectVariant(match);
  };

  const handleColorChange = (colorName: string) => {
    const match = variants.find((v) => v.colorName === colorName && v.size === selectedSize) ||
                  variants.find((v) => v.colorName === colorName);
    if (match) onSelectVariant(match);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-[#F4E3DF]">
      
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider">
              Color: <strong className="text-[#8C5353]">{selectedColor}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {colors.map((c) => {
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => handleColorChange(c.name)}
                  className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                    isSelected ? 'border-[#8C5353] ring-2 ring-[#E8C4C0]' : 'border-stone-300 hover:border-stone-500'
                  }`}
                  title={c.name}
                >
                  <span
                    className="w-full h-full rounded-full border border-stone-200"
                    style={{ backgroundColor: c.hex || '#F4E3DF' }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs uppercase font-semibold text-[#2D2325] tracking-wider">
              Size: <strong className="text-[#8C5353]">{selectedSize}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {sizes.map((s) => {
              const matchingVar = variants.find((v) => v.size === s && v.colorName === selectedColor) ||
                                  variants.find((v) => v.size === s);
              const isAvailable = matchingVar ? matchingVar.stockQuantity > 0 : false;
              const isSelected = selectedSize === s;

              return (
                <button
                  key={s}
                  disabled={!isAvailable}
                  onClick={() => handleSizeChange(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                    isSelected
                      ? 'bg-[#2D2325] text-white border-[#2D2325] shadow-sm'
                      : isAvailable
                      ? 'bg-white text-[#4A3E3F] border-[#E8C4C0] hover:bg-[#FAF5F3]'
                      : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Stock status */}
      {selectedVariant && (
        <div className="text-xs">
          {selectedVariant.stockQuantity > 0 ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock ({selectedVariant.stockQuantity} units remaining)
            </span>
          ) : (
            <span className="text-red-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Currently Out of Stock in this size/color
            </span>
          )}
        </div>
      )}
    </div>
  );
};
