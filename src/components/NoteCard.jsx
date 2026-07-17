import React from 'react';
import { useNotes } from '../context/NotesContext';
import { Pin, Trash2 } from 'lucide-react';
import { Spinner } from './Spinner';

export const NoteCard = ({ note }) => {
  const {
    deletingIds,
    pinningIds,
    handleTogglePin,
    handleDeleteNote,
    handleOpenEditModal,
    formatDate
  } = useNotes();

  const isDeleting = deletingIds.has(note.id);
  const isPinning = pinningIds.has(note.id);

  return (
    <div
      className={`note-card color-${note.color || 'slate'}${isDeleting ? ' note-action-loading' : ''}`}
      onClick={() => handleOpenEditModal(note)}
    >
      <div className="note-header">
        <h4 className="note-title">{note.title || 'Untitled'}</h4>
        <button
          className={`note-pin-btn${note.pinned ? ' pinned' : ''}${isPinning ? ' note-action-loading' : ''}`}
          onClick={(e) => handleTogglePin(e, note)}
          disabled={isPinning}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          {isPinning ? (
            <Spinner size={16} color="currentColor" />
          ) : (
            <Pin size={16} fill={note.pinned ? 'currentColor' : 'none'} />
          )}
        </button>
      </div>
      <p className="note-content">{note.content}</p>

      {note.tags && note.tags.length > 0 && (
        <div className="note-tags-container">
          {note.tags.map(tag => (
            <span key={tag} className="note-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">
          {formatDate(note.updatedAt)}
        </span>
        <div className="note-actions">
          <button
            className="note-action-btn delete"
            onClick={(e) => handleDeleteNote(e, note.id)}
            title="Delete note"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner size={15} color="currentColor" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
