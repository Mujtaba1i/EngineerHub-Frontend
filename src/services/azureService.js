import { BlobServiceClient } from '@azure/storage-blob';

// Azure configuration
const ACCOUNT_NAME = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const SAS_TOKEN = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;
const CONTAINER_NAME = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;

// Remove leading ? from SAS token if present (will add it back when needed)
const SAS_TOKEN_CLEAN = SAS_TOKEN.startsWith('?') ? SAS_TOKEN.substring(1) : SAS_TOKEN;

// Create blob service client - proper URL with SAS token
const blobServiceClient = new BlobServiceClient(
  `https://${ACCOUNT_NAME}.blob.core.windows.net?${SAS_TOKEN_CLEAN}`
);

const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * Upload file directly to Azure Blob Storage
 * @param {File} file - The file to upload
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<object>} - Returns { fileKey, fileName, fileSize, fileType, url }
 */
export const uploadFileToAzure = async (file, onProgress) => {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const uniqueFileName = `notes/${timestamp}_${randomString}.${fileExtension}`;

    // Get blob client
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

    // Upload with progress tracking using uploadBrowserData for browser environments
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
      onProgress: onProgress ? (ev) => {
        const progress = Math.round((ev.loadedBytes / file.size) * 100);
        onProgress(progress);
      } : undefined,
    };

    await blockBlobClient.uploadBrowserData(file, uploadOptions);

    // Construct full URL with SAS token (add back the ?)
    const fullUrl = `https://${ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${uniqueFileName}?${SAS_TOKEN_CLEAN}`;

    return {
      fileKey: uniqueFileName,
      fileName: file.name,
      fileSize: file.size,
      fileType: getFileType(file.name),
      url: fullUrl,
    };
  } catch (error) {
    console.error('Azure Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Check if file exists in Azure Blob Storage
 * @param {string} fileKey - The blob name/key to check
 * @returns {Promise<boolean>} - True if file exists, false otherwise
 */
export const fileExistsInAzure = async (fileKey) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);
    await blockBlobClient.getProperties();
    return true;
  } catch (error) {
    // If error is 404, file doesn't exist
    if (error.code === 'BlobNotFound' || error.status === 404) {
      return false;
    }
    // For other errors, log and treat as not existing to avoid blocking
    console.warn(`Warning checking file existence: ${error.message}`);
    return false;
  }
};

/**
 * Delete file from Azure Blob Storage
 * @param {string} fileKey - The blob name/key to delete
 * @returns {Promise}
 */
export const deleteFileFromAzure = async (fileKey) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileKey);
    await blockBlobClient.delete();
    return { success: true };
  } catch (error) {
    // If file is already deleted (404), consider it success
    if (error.code === 'BlobNotFound' || error.status === 404) {
      return { success: true, alreadyDeleted: true };
    }
    console.error('Azure Delete Error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get public URL for a blob (works if container is public or with SAS)
 * @param {string} fileKey - The blob name/key
 * @returns {string} - Public URL
 */
export const getAzureBlobUrl = (fileKey) => {
  // Return full URL with SAS token (SAS_TOKEN_CLEAN doesn't have the ?)
  return `https://${ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${fileKey}?${SAS_TOKEN_CLEAN}`;
};

/**
 * Get file type from filename
 * @param {string} filename
 * @returns {string} - 'pdf', 'document', 'image', or 'other'
 */
function getFileType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'document';
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return 'image';
  return 'other';
}

/**
 * Validate file before upload
 * @param {File} file
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'gif'];
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  const ext = file.name.toLowerCase().split('.').pop();
  if (!allowedExtensions.includes(ext)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}` 
    };
  }

  return { valid: true };
};