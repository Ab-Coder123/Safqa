'use client';

import React, { useState } from 'react';
import { Button, Input, useToast } from '@/components/ui';
import { UploadCloud, X, Plus, Image as ImageIcon, Star } from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ProductImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ProductImageUploaderProps) {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      toast({
        title: 'رابط غير صالح',
        description: 'يجب أن يبدأ رابط الصورة بـ https:// أو http://',
        type: 'error',
      });
      return;
    }

    if (images.length >= maxImages) {
      toast({
        title: 'الحد الأقصى للصور',
        description: `لا يمكن إضافة أكثر من ${maxImages} صور لكل إعلان`,
        type: 'warning',
      });
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput('');
    setShowUrlField(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'الحد الأقصى للصور',
        description: `لا يمكن إضافة أكثر من ${maxImages} صور لكل إعلان`,
        type: 'warning',
      });
      return;
    }

    const newUrls: string[] = [];
    const count = Math.min(files.length, remainingSlots);

    for (let i = 0; i < count; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'ملف غير مدعوم',
          description: 'يرجى اختيار صور فقط بصيغة JPG أو PNG أو WEBP',
          type: 'error',
        });
        continue;
      }
      // Create local object URL for preview and payload
      const objectUrl = URL.createObjectURL(file);
      newUrls.push(objectUrl);
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[var(--primary)]" />
          صور الإعلان *
          <span className="text-[11px] font-normal text-[var(--muted-foreground)]">
            (صورة واحدة على الأقل، بحد أقصى {maxImages} صور)
          </span>
        </label>
        <span className="text-xs font-bold text-[var(--primary)]">
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-[var(--border)] bg-[var(--muted)] group shadow-sm"
          >
            <img
              src={url}
              alt={`صورة ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {idx === 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[var(--primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                <Star className="w-2.5 h-2.5 fill-current" />
                الرئيسية
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-md transition-colors cursor-pointer"
              title="حذف الصورة"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload placeholder button */}
        {images.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--primary)]/5 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors group">
            <UploadCloud className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors mb-1" />
            <span className="text-[11px] font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
              رفع صورة
            </span>
            <span className="text-[9px] text-[var(--muted-foreground)]">JPG, PNG, WEBP</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Alternative: Add Image URL */}
      {images.length < maxImages && (
        <div className="pt-1">
          {!showUrlField ? (
            <button
              type="button"
              onClick={() => setShowUrlField(true)}
              className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              أو إضافة رابط صورة خارجي (URL)
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <Input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="text-xs h-9"
              />
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleAddUrl}
                className="h-9 text-xs flex-shrink-0"
              >
                إضافة
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowUrlField(false)}
                className="h-9 text-xs"
              >
                إلغاء
              </Button>
            </div>
          )}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400">
          ⚠️ يجب إضافة صورة واحدة على الأقل لعرض الإعلان للمشترين.
        </p>
      )}
    </div>
  );
}
