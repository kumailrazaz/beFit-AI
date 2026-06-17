import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  isDragging: boolean;
  preview: string | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  accept?: string;
  label?: string;
  description?: string;
}

export default function UploadArea({
  isDragging,
  preview,
  onDrop,
  onDragOver,
  onDragLeave,
  onInputChange,
  onReset,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Upload an image',
  description = 'Drag & drop or click to browse',
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (preview) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-border">
        <img
          src={preview}
          alt="Upload preview"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-danger/90 text-white rounded-lg text-sm font-medium hover:bg-danger transition-colors cursor-pointer"
          >
            Remove Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      whileHover={{ scale: 1.01 }}
      className={`
        relative flex flex-col items-center justify-center
        h-64 rounded-xl border-2 border-dashed cursor-pointer
        transition-all duration-300
        ${
          isDragging
            ? 'border-primary bg-primary-glow scale-[1.02]'
            : 'border-border hover:border-primary/40 hover:bg-bg-tertiary/30'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
        aria-label={label}
      />
      <motion.div
        animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-14 h-14 rounded-2xl bg-bg-tertiary flex items-center justify-center">
          {isDragging ? (
            <Upload className="w-6 h-6 text-primary" />
          ) : (
            <ImageIcon className="w-6 h-6 text-text-muted" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-muted mt-1">{description}</p>
        </div>
        <p className="text-xs text-text-muted">JPG, PNG, or WebP</p>
      </motion.div>
    </motion.div>
  );
}
