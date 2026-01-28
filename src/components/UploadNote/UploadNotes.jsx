import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as noteService from '../../services/noteService';
import { uploadFileToAzure, validateFile } from '../../services/azureService';
import styles from './UploadNote.module.css';

const UploadNote = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    course_name: '',
    year: new Date().getFullYear(),
    doctor_name: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // Redirect if not authorized
  useEffect(()=>{
    if (!user || (user.role !== 'student' && user.role !== 'graduate')) {
      navigate('/');
    }
  }, [user, navigate])


  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error);
        setFile(null);
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Validate all required fields
    if (!formData.title.trim()) {
      setError('Please enter a title for the note');
      return;
    }
    if (!formData.course_code.trim()) {
      setError('Please enter a course code');
      return;
    }
    if (!formData.doctor_name.trim()) {
      setError('Please enter the doctor/instructor name');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      // Step 1: Upload file directly to Azure Blob Storage
      const azureResult = await uploadFileToAzure(file, (progress) => {
        setUploadProgress(progress);
      });

      // Step 2: Create note record in backend with Azure blob info
      const noteData = {
        title: formData.title,
        file_name: azureResult.fileName,
        file_key: azureResult.fileKey,
        file_type: azureResult.fileType,
        file_size: azureResult.fileSize,
        course_code: formData.course_code,
        course_name: formData.course_name || null,
        year: formData.year,
        doctor_name: formData.doctor_name,
        description: formData.description || null,
      };

      await noteService.createNote(noteData);
      
      // Success! Navigate back to notes page
      navigate('/notes');
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload note');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <main className={styles.uploadPage}>
      <div className={styles.container}>
        <h1>Upload Study Note</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fileUpload}>
            <label htmlFor="file" className={styles.fileLabel}>
              {file ? `📎 ${file.name}` : '📁 Choose File'}
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className={styles.fileInput}
              required
              disabled={uploading}
            />
            <p className={styles.fileHint}>
              Allowed: PDF, DOCX, DOC, Images (PNG, JPG, GIF) • Max 10MB
            </p>
            
            {uploading && uploadProgress > 0 && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className={styles.progressText}>{uploadProgress}% uploaded to Azure</p>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 3 Notes - Data Structures"
              required
              disabled={uploading}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="course_code">Course Code *</label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                placeholder="e.g., CS101"
                required
                disabled={uploading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
                required
                disabled={uploading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="course_name">Course Name</label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              placeholder="e.g., Introduction to Computer Science"
              disabled={uploading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="doctor_name">Doctor Name *</label>
            <input
              type="text"
              id="doctor_name"
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleChange}
              placeholder="e.g., Dr. Ahmed Ali"
              required
              disabled={uploading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about this note..."
              rows="4"
              disabled={uploading}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : '📤 Upload Note'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/notes')}
              className={styles.cancelBtn}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UploadNote;