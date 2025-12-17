# Comprehensive Product Image Management System

## Overview

This document outlines the implementation of a comprehensive product image management system that enables users to upload, replace, and delete multiple images for individual products through a secure file upload interface.

## Features Implemented

### 1. Enhanced Image Upload System

- **Multiple Image Upload**: Supports uploading multiple images at once
- **File Validation**: Validates image types (JPEG, PNG, WebP) and size limits (5MB per image)
- **Count Validation**: Limits to maximum 10 images per product
- **Bulk Replacement**: Automatically deletes all existing images before uploading new ones (clean state transition)
- **UUID-based Filenames**: Generates unique filenames to prevent conflicts

### 2. Comprehensive Deletion Methods

#### Granular Deletion by Unique Identifier

1. **By Image ID**: `/products/:id/images/:imageId` - Delete specific image by database ID
2. **By Filename**: `/products/:productId/images/by-filename?filename=<name>` - Delete by filename
3. **By URL Parameter**: `/products/:productId/images/by-url?url=<param>` - Delete by URL parameter

#### Bulk Deletion Workflow

- **Replacement Mode**: When uploading new images, all existing images are automatically deleted
- **Clean State**: Ensures no orphaned images remain after replacement

### 3. Enhanced Error Handling and Validation

#### Error Types

- **ValidationError**: File format and size validation errors
- **NotFoundError**: Product or image not found errors
- **BadRequestError**: Invalid requests and parameter errors

#### Validation Features

- **File Type Validation**: Only allows JPEG, PNG, and WebP formats
- **File Size Validation**: Enforces 5MB limit per image
- **Image Count Validation**: Maximum 10 images per product
- **Parameter Validation**: Validates required parameters for all operations

### 4. Standardized Response Format

#### Success Response

```json
{
	"success": true,
	"message": "Operation completed successfully",
	"data": {
		// Response data
	}
}
```

#### Error Response

```json
{
	"success": false,
	"error": "Error description",
	"details": {} // Additional error details if available
}
```

### 5. Security and Access Control

- **Authentication Required**: All image operations require authentication
- **Role-based Access**: Only SUPER_ADMIN role can perform image operations
- **Secure Storage**: Images stored in Arvan cloud object storage with organized directory structure

### 6. File Organization

- **Storage Path**: `/uploads/products/{productId}/{filename}`
- **Filename Generation**: `{uuid}.webp` format for consistent naming
- **Database Tracking**: All images tracked in ProductImage table with order information

## API Endpoints

### Image Upload

- `PUT /products/:id/images` - Upload/replace images (multipart/form-data)

### Image Deletion

- `DELETE /products/:id/images/:imageId` - Delete by image ID
- `DELETE /products/:productId/images/by-filename?filename=<name>` - Delete by filename
- `DELETE /products/:productId/images/by-url?url=<param>` - Delete by URL parameter

### Image Management

- `PUT /products/:id/images/reorder` - Reorder images
- `GET /products/:id/upload-url` - Get presigned upload URL

## Implementation Details

### Service Layer Enhancements

- `ProductService.uploadImages()` - Enhanced with validation and error handling
- `ProductService.deleteImage()` - Improved with better error messages
- `ProductService.deleteImageByFilename()` - New method for filename-based deletion
- `ProductService.deleteImageByUrlParameter()` - New method for URL parameter deletion

### Controller Improvements

- Comprehensive error handling with `createErrorResponse()`
- Standardized response formatting
- Support for all deletion methods
- Enhanced validation

### Database Integration

- Uses existing ProductImage model without schema changes
- Maintains order tracking for images
- Cascade deletion support

## Usage Examples

### Upload Multiple Images

```bash
curl -X PUT "http://localhost:3000/products/PRODUCT_ID/images" \
  -H "Authorization: Bearer TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.png"
```

### Delete Image by ID

```bash
curl -X DELETE "http://localhost:3000/products/PRODUCT_ID/images/IMAGE_ID" \
  -H "Authorization: Bearer TOKEN"
```

### Delete Image by Filename

```bash
curl -X DELETE "http://localhost:3000/products/PRODUCT_ID/images/by-filename?filename=abc123.webp" \
  -H "Authorization: Bearer TOKEN"
```

### Delete Image by URL Parameter

```bash
curl -X DELETE "http://localhost:3000/products/PRODUCT_ID/images/by-url?url=abc123" \
  -H "Authorization: Bearer TOKEN"
```

## Benefits

1. **Flexibility**: Multiple deletion methods accommodate different use cases
2. **Reliability**: Comprehensive validation ensures data integrity
3. **User Experience**: Clear error messages and success feedback
4. **Security**: Role-based access control and secure file handling
5. **Scalability**: Organized file structure and efficient storage management
6. **Maintainability**: Clean code structure with proper error handling

## Compliance with Requirements

✅ **Multiple Image Upload**: Supports uploading multiple images per product
✅ **New Image Uploads**: Handles new image uploads with validation
✅ **Replacement Workflows**: Bulk deletion before new uploads ensures clean state
✅ **Granular Deletion**: Supports deletion by image ID, filename, and URL parameter
✅ **Organized Storage**: Maintains proper directory structure in Arvan cloud
✅ **ImageValidationOptions**: Keeps existing validation options unchanged
✅ **Error Handling**: Comprehensive error handling with specific error types
✅ **User Feedback**: Standardized response format with success/error messages
✅ **No Schema Changes**: Implementation respects existing Prisma schema

The system is now ready for production use with comprehensive image management capabilities.
