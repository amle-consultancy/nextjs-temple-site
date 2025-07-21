'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { formatFileSize } from '@/lib/image-utils';

export default function ImageUpload({ 
  onImageUploaded, 
  onImageDeleted, 
  currentImageUrl = null,
  disabled = false 
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  
  const {
    isUploading,
    uploadProgress,
    uploadedImage,
    error,
    uploadImage,
    deleteImage,
    resetUpload,
  } = useImageUpload();

  // Use uploaded image or current image URL
  const displayImageUrl = uploadedImage?.url || currentImageUrl;

  const handleFileSelect = async (file) => {
    if (!file || disabled) return;

    const result = await uploadImage(file);
    if (result.success && onImageUploaded) {
      onImageUploaded(result.data.url);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDeleteImage = async () => {
    if (!displayImageUrl || disabled) return;

    const result = await deleteImage(displayImageUrl);
    if (result.success) {
      resetUpload();
      if (onImageDeleted) {
        onImageDeleted();
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="temple-image">Temple Image</Label>
      
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {displayImageUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={displayImageUrl}
                alt="Temple preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleDeleteImage}
                disabled={disabled || isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {uploadedImage && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Size: {formatFileSize(uploadedImage.size)}</p>
                <p>Type: {uploadedImage.type}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      {!displayImageUrl && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <>
                <Upload className="h-8 w-8 text-primary animate-pulse" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  JPG, JPEG, PNG, WEBP up to 2.5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-gray-600">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}

      {/* File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Button (alternative to drag & drop) */}
      {!displayImageUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Image File
        </Button>
      )}

      {/* Replace Image Button */}
      {displayImageUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Replace Image
        </Button>
      )}
    </div>
  );
}