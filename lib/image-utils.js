export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/webp"
];

// Maximum file size (2.5MB in bytes)
export const MAX_IMAGE_SIZE = 2.5 * 1024 * 1024;

export function validateImageType(file) {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function validateImageSize(file) {
  return file.size <= MAX_IMAGE_SIZE;
}

export function validateImage(file) {
  if (!file) {
    return {
      success: false,
      error: "No file provided"
    };
  }

  if (!validateImageType(file)) {
    return {
      success: false,
      error: "Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed"
    };
  }

  if (!validateImageSize(file)) {
    return {
      success: false,
      error: "File size exceeds 2.5MB limit"
    };
  }

  return {
    success: true,
    error: null
  };
}

export function generateUniqueFilename(originalName, prefix = "temple-images") {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.split('.').pop();
  return `${prefix}/${timestamp}-${randomString}.${fileExtension}`;
}

export function isVercelBlobUrl(url) {
  return url && url.includes("blob.vercel-storage.com");
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

export function isAllowedExtension(filename) {
  const extension = getFileExtension(filename);
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  return allowedExtensions.includes(extension);
}