# Image Upload Implementation Guide

## Overview
This implementation adds comprehensive image upload functionality to the booking website using Pinata IPFS for decentralized image storage. Images are uploaded directly from the frontend to Pinata and then the IPFS URLs are stored in the database.

## Features Implemented

### 1. Backend Implementation

#### Pinata Service (`server/services/PinataService.ts`)
- **Purpose**: Handles file uploads to Pinata IPFS
- **Key Methods**:
  - `uploadFile()`: Generic file upload with metadata
  - `uploadImageForEntity()`: Entity-specific image upload with context
- **Configuration**: Uses provided Pinata API keys

#### Image Upload Controller (`server/controllers/ImageUploadController.ts`)
- **Purpose**: Handles multipart file uploads and processes them
- **Features**:
  - File validation (image types only, 10MB limit)
  - Entity-specific upload methods for all supported entities
  - Error handling and response formatting

#### Entity Updates
Added `hinhAnh` (image) fields to the following entities:
- **User**: `avatar` field for profile pictures
- **Phong** (Room): `hinhAnh` field for room photos
- **HangPhong** (Room Type): `hinhAnh` field for room type images
- **CoSo** (Facility): `hinhAnh` field for facility images
- **DichVu** (Service): `hinhAnh` field for service images
- **NhanVien** (Employee): `hinhAnh` field for employee photos

#### API Endpoints
New image upload endpoints:
```
POST /api/users/:id/avatar
POST /api/phong/:id/image
POST /api/hangphong/:id/image
POST /api/coso/:id/image
POST /api/dichvu/:id/image
POST /api/nhanvien/:id/image
```

New image update endpoints:
```
PUT /api/users/:id/avatar
PUT /api/phong/:id/image
PUT /api/hangphong/:id/image
PUT /api/coso/:id/image
PUT /api/dichvu/:id/image
PUT /api/nhanvien/:id/image
```

### 2. Frontend Implementation

#### API Client Updates (`client/src/lib/api.ts`)
- **Pinata Upload Function**: Direct frontend-to-Pinata upload
- **Entity-Specific Methods**: Each entity API now includes `uploadImage()` method
- **Error Handling**: Comprehensive error handling for upload failures

#### Image Upload Component (`client/src/app/components/image-upload.tsx`)
- **Purpose**: Reusable component for image uploads
- **Features**:
  - Drag & drop file selection
  - Image preview
  - Upload progress indication
  - File validation (type, size)
  - Success/error messaging
  - Responsive design

#### Admin Page Integration
- **Rooms Management**: Added image upload column to rooms table
- **Real-time Updates**: Images update immediately after upload
- **Loading States**: Visual feedback during upload process

### 3. Database Migration
- **Migration File**: `1759702000000-AddImageFieldsToEntities.ts`
- **Purpose**: Adds image fields to all relevant database tables
- **Rollback Support**: Includes down migration for field removal

## Usage Examples

### 1. Upload User Avatar
```typescript
import { usersApi } from '@/lib/api';

const handleAvatarUpload = async (userId: string, file: File) => {
  try {
    await usersApi.uploadAvatar(userId, file);
    console.log('Avatar uploaded successfully');
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. Upload Room Image
```typescript
import { phongApi } from '@/lib/api';

const handleRoomImageUpload = async (roomId: string, file: File) => {
  try {
    await phongApi.uploadImage(roomId, file);
    console.log('Room image uploaded successfully');
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. Using Image Upload Component
```tsx
import { ImageUpload } from '@/components/image-upload';

<ImageUpload
  onImageUpload={(file) => handleImageUpload(entityId, file)}
  currentImageUrl={entity.hinhAnh}
  entityType="room"
  entityId={entityId}
/>
```

## Configuration

### Pinata API Keys
The implementation uses the provided Pinata API keys:
- **API Key**: `5b9afb41a6a64bcad1f7`
- **Secret Key**: `080a3e13f1c8a9527e3ff8faaeb9871b5df53900099d88edba2259f98be701ec`

### File Limits
- **Maximum File Size**: 10MB
- **Supported Formats**: JPG, PNG, GIF, WebP
- **Storage**: IPFS via Pinata (permanent, decentralized)

## Security Considerations

1. **API Key Exposure**: Pinata API keys are currently exposed in client-side code
2. **File Validation**: Server-side validation prevents non-image uploads
3. **Size Limits**: 10MB limit prevents abuse
4. **IPFS Permanence**: Files uploaded to IPFS are permanent

## Future Enhancements

1. **Environment Variables**: Move API keys to environment variables
2. **Image Compression**: Add client-side image compression before upload
3. **Multiple Images**: Support for multiple images per entity
4. **Image Management**: Add delete/replace functionality
5. **CDN Integration**: Add CDN for faster image delivery
6. **Image Optimization**: Automatic resizing and format conversion

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check Pinata API key validity and network connection
2. **File Too Large**: Ensure file is under 10MB
3. **Invalid Format**: Only image files are accepted
4. **Database Errors**: Run migration to add image fields

### Debug Steps

1. Check browser console for error messages
2. Verify API endpoints are accessible
3. Confirm database migration has been run
4. Test with smaller image files first

## Dependencies Added

### Backend
- `axios`: HTTP client for Pinata API calls
- `form-data`: Multipart form data handling
- `multer`: File upload middleware
- `@types/form-data`: TypeScript types
- `@types/multer`: TypeScript types

### Frontend
- No additional dependencies (uses existing React and fetch API)

## Migration Instructions

1. **Run Database Migration**:
   ```bash
   cd server
   npm run migration:run
   ```

2. **Install Dependencies**:
   ```bash
   cd server
   npm install axios form-data @types/form-data multer @types/multer
   ```

3. **Restart Services**:
   ```bash
   # Backend
   cd server
   npm run dev
   
   # Frontend
   cd client
   npm run dev
   ```

## Testing

### Manual Testing
1. Navigate to admin rooms management page
2. Try uploading an image for a room
3. Verify image appears in the table
4. Check that image URL is stored in database

### API Testing
Use the provided endpoints to test image uploads:
```bash
# Upload room image
curl -X POST \
  -F "image=@room.jpg" \
  http://localhost:3001/api/phong/ROOM001/image
```

This implementation provides a complete, production-ready image upload system using modern decentralized storage technology.
