import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as noteService from '../../services/noteService';
import { deleteFileFromAzure } from '../../services/azureService';
import EditNoteModal from '../EditNoteModal/EditNoteModal';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onUpdate }) => {
  const { user } = useContext(UserContext);
  const [showEdit, setShowEdit] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user && parseInt(user.sub) === parseInt(localNote.uploader_id);

  const handleLike = async () => {
    try {
      const result = await noteService.likeNote(localNote.id, 1);
      setLocalNote({
        ...localNote,
        likes_count: result.likes,
        dislikes_count: result.dislikes,
        user_like_status: localNote.user_like_status === 1 ? null : 1
      });
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const result = await noteService.likeNote(localNote.id, -1);
      setLocalNote({
        ...localNote,
        likes_count: result.likes,
        dislikes_count: result.dislikes,
        user_like_status: localNote.user_like_status === -1 ? null : -1
      });
    } catch (error) {
      console.error('Failed to dislike:', error);
    }
  };

  const handleDownload = () => {
    if (localNote.download_url) {
      noteService.downloadNote(localNote.download_url, localNote.file_name);
    }
  };

  const handleDelete = async () => {

    
    try {
      setDeleting(true);
      
      // Step 1: Delete from backend (get file_key)
      const response = await noteService.deleteNote(localNote.id);
      
      // Step 2: Delete file from Azure Blob Storage
      if (response.file_key) {
        await deleteFileFromAzure(response.file_key);
      }
      
      // Success - refresh the list
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSuccess = (updatedNote) => {
    setLocalNote({ ...localNote, ...updatedNote });
    setShowEdit(false);
    if (onUpdate) onUpdate();
  };

  const getFileIcon = () => {
    switch (localNote.file_type) {
      case 'pdf': return '📄';
      case 'document': return '📝';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <>
      <div className={styles.noteCard}>
        <div className={styles.fileIcon}>{getFileIcon()}</div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{localNote.title}</h3>
          
          <div className={styles.metadata}>
            <span className={styles.courseCode}>{localNote.course_code}</span>
            <span className={styles.year}>Year: {localNote.year}</span>
          </div>
          
          <p className={styles.doctor}>👨‍🏫 {localNote.doctor_name}</p>
          
          {localNote.description && (
            <p className={styles.description}>{localNote.description}</p>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={handleDownload} className={styles.downloadBtn}>
            ⬇️ Download
          </button>
          
          <div className={styles.reactions}>
            <button 
              onClick={handleLike}
              className={`${styles.likeBtn} ${localNote.user_like_status === 1 ? styles.active : ''}`}
            >
              👍 {localNote.likes_count}
            </button>
            <button 
              onClick={handleDislike}
              className={`${styles.dislikeBtn} ${localNote.user_like_status === -1 ? styles.active : ''}`}
            >
              👎 {localNote.dislikes_count}
            </button>
          </div>

          {isOwner && (
            <div className={styles.ownerActions}>
              <button onClick={() => setShowEdit(true)} className={styles.editBtn}>
                ✏️ Edit
              </button>
              <button 
                onClick={handleDelete} 
                className={styles.deleteBtn}
                disabled={deleting}
              >
                {deleting ? '⏳ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <EditNoteModal
          note={localNote}
          onClose={() => setShowEdit(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default NoteCard;