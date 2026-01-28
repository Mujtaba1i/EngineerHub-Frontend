import axios from 'axios';
import { getAzureBlobUrl } from './azureService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all notes with optional filters
export async function getAllNotes(filters = {}) {
  const params = new URLSearchParams();
  if (filters.course_code) params.append('course_code', filters.course_code);
  if (filters.year) params.append('year', filters.year);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/notes?${params.toString()}`);
  
  // Add download URLs to each note
  return response.data.map(note => ({
    ...note,
    download_url: getAzureBlobUrl(note.file_key)
  }));
}

// Get single note
export async function getNote(noteId) {
  const response = await api.get(`/notes/${noteId}`);
  
  // Add download URL
  return {
    ...response.data,
    download_url: getAzureBlobUrl(response.data.file_key)
  };
}

// Create note (metadata only - file already uploaded to Azure)
export async function createNote(noteData) {
  const response = await api.post('/notes', noteData);
  return response.data;
}

// Update note metadata
export async function updateNote(noteId, noteData) {
  const response = await api.put(`/notes/${noteId}`, noteData);
  return response.data;
}

// Delete note
export async function deleteNote(noteId) {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
}

// Like or dislike a note
export async function likeNote(noteId, isLike) {
  const response = await api.post(`/notes/${noteId}/like`, null, {
    params: { is_like: isLike }
  });
  return response.data;
}

// Download note (opens in new tab)
export function downloadNote(downloadUrl, fileName) {
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// List orphaned Azure files (files uploaded but not in database)
// This runs entirely on the frontend - no backend Azure calls
export async function listOrphanedFiles() {
  try {
    // Step 1: Get all files from Azure directly
    const azureFiles = await getAllFilesFromAzure();
    
    // Step 2: Get all file_keys that exist in the database
    const response = await api.get('/notes/existing-file-keys');
    const existingFileKeys = response.data.file_keys || [];
    
    // Step 3: Find orphaned files (in Azure but not in database)
    const orphanedFiles = azureFiles.filter(file => 
      !existingFileKeys.includes(file.file_key)
    );
    
    return {
      files: orphanedFiles,
      count: orphanedFiles.length,
      message: `Found ${orphanedFiles.length} files in Azure without database records`
    };
  } catch (error) {
    console.error('Error listing orphaned files:', error);
    return {
      files: [],
      count: 0,
      message: 'Could not list Azure files',
      error: error.message
    };
  }
}

// Helper function to get all files directly from Azure
async function getAllFilesFromAzure() {
  try {
    const { BlobServiceClient } = await import('@azure/storage-blob');
    
    const ACCOUNT_NAME = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    const SAS_TOKEN = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;
    const CONTAINER_NAME = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;
    
    const SAS_TOKEN_CLEAN = SAS_TOKEN.startsWith('?') ? SAS_TOKEN.substring(1) : SAS_TOKEN;
    const blobServiceClient = new BlobServiceClient(
      `https://${ACCOUNT_NAME}.blob.core.windows.net?${SAS_TOKEN_CLEAN}`
    );
    
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobs = containerClient.listBlobsFlat();
    
    const files = [];
    for await (const blob of blobs) {
      files.push({
        file_key: blob.name,
        file_name: blob.name.split('/').pop(),
        created_at: blob.properties.createdOn?.toISOString() || null,
        size: blob.properties.contentLength || 0
      });
    }
    
    return files;
  } catch (error) {
    console.error('Error getting Azure files:', error);
    return [];
  }
}

// Recover an orphaned file by creating a database record for it
export async function recoverFile(fileKey, metadata) {
  const response = await api.post('/notes/recover-file', null, {
    params: {
      file_key: fileKey,
      title: metadata.title,
      course_code: metadata.course_code,
      course_name: metadata.course_name || '',
      year: metadata.year,
      doctor_name: metadata.doctor_name,
      description: metadata.description || ''
    }
  });
  return response.data;
}