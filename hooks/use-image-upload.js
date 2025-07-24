import { useState } from 'react';
import { validateImage } from '@/lib/image-utils';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate the image file
      const validation = validateImage(file);
      if (!validation.success) {
        throw new Error(validation.error);
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Simulate upload progress (since we can't track real progress with fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to API
      const response = await fetch('/api/places/images', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadedImage(result.data);
      return {
        success: true,
        data: result.data,
      };

    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      setError(null);

      const response = await fetch('/api/places/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      // Clear uploaded image if it matches the deleted URL
      if (uploadedImage?.url === imageUrl) {
        setUploadedImage(null);
      }

      return {
        success: true,
        message: result.message,
      };

    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Reset the upload state
   */
  const resetUpload = () => {
    setUploadedImage(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  /**
   * Handle file input change
   * @param {Event} event - File input change event
   */
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  return {
    // State
    isUploading,
    uploadProgress,
    uploadedImage,
    error,
    
    // Actions
    uploadImage,
    deleteImage,
    resetUpload,
    handleFileChange,
  };
}