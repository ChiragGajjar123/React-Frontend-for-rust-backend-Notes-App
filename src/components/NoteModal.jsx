import React from 'react';
import { useNotes } from '../context/NotesContext';
import { X, Check } from 'lucide-react';
import { Spinner } from './Spinner';

export const NoteModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    editingNote,
    noteForm,
    setNoteForm,
    tagInput,
    setTagInput,
    modalSaving,
    handleFormSubmit,
    handleAddTag,
    handleRemoveTag
  } = useNotes();

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingNote ? 'Edit Note' : 'Create Note'}
          </h3>
          <button
            className="modal-close-btn"
            onClick={() => setIsModalOpen(false)}
            disabled={modalSaving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="modal-title">Title</label>
              <input
                id="modal-title"
                type="text"
                className="form-input"
                style={{ paddingLeft: '16px' }}
                placeholder="Note title..."
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                disabled={modalSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-content">Content</label>
              <textarea
                id="modal-content"
                className="form-input"
                style={{ paddingLeft: '16px', minHeight: '120px', resize: 'vertical' }}
                placeholder="Write your note contents here..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                disabled={modalSaving}
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tag-input-container">
                {noteForm.tags.map(tag => (
                  <span key={tag} className="tag-badge">
                    #{tag}
                    <button
                      type="button"
                      className="tag-remove-btn"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={modalSaving}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="tag-text-input"
                  placeholder="Add tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  onBlur={handleAddTag}
                  disabled={modalSaving}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Note Color</label>
              <div className="color-selector">
                {['slate', 'blue', 'green', 'yellow', 'purple', 'rose'].map(colorOpt => (
                  <div
                    key={colorOpt}
                    className={`color-option ${colorOpt} ${noteForm.color === colorOpt ? 'selected' : ''}`}
                    onClick={() => !modalSaving && setNoteForm({ ...noteForm, color: colorOpt })}
                  >
                    {noteForm.color === colorOpt && (
                      <Check
                        size={14}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                id="modal-pin"
                type="checkbox"
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                checked={noteForm.pinned}
                onChange={(e) => setNoteForm({ ...noteForm, pinned: e.target.checked })}
                disabled={modalSaving}
              />
              <label htmlFor="modal-pin" style={{ cursor: 'pointer', textTransform: 'none', fontSize: '0.95rem' }}>
                Pin this note to the top
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={modalSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary btn-submit${modalSaving ? ' btn-loading' : ''}`}
              disabled={modalSaving}
            >
              {modalSaving ? (
                <><Spinner size={18} color="white" /> Saving…</>
              ) : (
                <><Check size={18} /><span>Save Note</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
