'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui';

interface ProductGalleryProps {
  media?: { id?: string; url: string; order?: number }[];
  title: string;
  status?: string;
}

export function ProductGallery({ media = [], title, status }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = media.length > 0 ? media.map((m) => m.url) : [];
  const currentImage = images[selectedIndex] || 'https://placehold.co/800x600/f1f5f9/94a3b8?text=No+Image';

  const isSold = status === 'SOLD';
  const isArchived = status === 'ARCHIVED';

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-3">
      {/* ── Main Display View ── */}
      <div
        onClick={() => images.length > 0 && setIsModalOpen(true)}
        className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-2xl bg-[var(--muted)] border border-[var(--border)] overflow-hidden cursor-pointer group select-none shadow-sm"
      >
        {images.length > 0 ? (
          <img
            src={currentImage}
            alt={`${title} - صورة ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted-foreground)] gap-2">
            <ImageIcon className="w-12 h-12 stroke-1" />
            <span className="text-xs">لا توجد صور إضافية</span>
          </div>
        )}

        {/* Status Badge */}
        {(isSold || isArchived) && (
          <div className="absolute top-4 right-4 z-10">
            <Badge
              variant={isSold ? 'secondary' : 'destructive'}
              className="text-xs font-bold px-3 py-1 shadow-md"
            >
              {isSold ? 'تم البيع' : 'إعلان مؤرشف'}
            </Badge>
          </div>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>{selectedIndex + 1}</span>
            <span>/</span>
            <span>{images.length}</span>
          </div>
        )}

        {/* Zoom Hint Icon */}
        {images.length > 0 && (
          <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>
        )}

        {/* Arrow Navigation (Desktop/Hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnails Strip ── */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-[var(--muted)]">
          {images.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/30 scale-102 shadow-sm'
                  : 'border-[var(--border)] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Fullscreen Zoom Lightbox Modal ── */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center select-none"
          >
            <img
              src={currentImage}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
