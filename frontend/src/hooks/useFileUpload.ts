import { useState, useCallback } from 'react';
import type { UploadState } from '../types';

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    isDragging: false,
  });

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadState({
        file,
        preview: reader.result as string,
        isDragging: false,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = useCallback(() => {
    setUploadState({ file: null, preview: null, isDragging: false });
  }, []);

  return {
    ...uploadState,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    reset,
  };
}
