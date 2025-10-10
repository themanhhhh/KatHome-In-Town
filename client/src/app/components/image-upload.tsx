'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './button/button';
import { Card } from './card/card';
import { Alert, AlertDescription } from './alert/alert';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  currentImageUrl?: string;
  entityType: string;
  entityId?: string; // Make optional since it's not used
  className?: string;
}

export function ImageUpload({ 
  onImageUpload, 
  currentImageUrl, 
  entityType, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  entityId: _entityId, // Prefix with underscore to indicate unused
  className = '' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await onImageUpload(file);
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-6 bg-white shadow-lg border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Image Upload</h3>
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {currentImageUrl && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Current Image:</p>
              <div className="relative inline-block">
                <Image
                  src={currentImageUrl}
                  alt={`${entityType} image`}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-lg object-cover border"
                />
              </div>
            </div>
          )}

          {!currentImageUrl && (
            <div className="flex items-center justify-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No image</p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>• Supported formats: JPG, PNG, GIF, WebP</p>
            <p>• Maximum file size: 10MB</p>
            <p>• Images are stored on IPFS via Pinata</p>
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
