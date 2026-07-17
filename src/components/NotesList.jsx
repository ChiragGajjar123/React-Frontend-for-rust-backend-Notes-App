import React from 'react';
import { useNotes } from '../context/NotesContext';
import { FileText, Plus, Pin } from 'lucide-react';
import { OverlayLoader } from './Spinner';
import { NoteCard } from './NoteCard';

export const NotesList = () => {
  const {
    loading,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    selectedTag,
    handleOpenCreateModal
  } = useNotes();

  if (loading) {
    return <OverlayLoader label="Loading notes…" />;
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="empty-state">
        <FileText className="empty-state-icon" size={60} />
        <h3>No Notes Found</h3>
        <p>
          {selectedTag
            ? `You don't have any notes tagged with "${selectedTag}".`
            : 'Get started by capturing your first thought today!'}
        </p>
        {!selectedTag && (
          <button className="btn-add-note" style={{ margin: '0 auto' }} onClick={handleOpenCreateModal}>
            <Plus size={20} />
            <span>Create a Note</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Pinned Notes Grid */}
      {pinnedNotes.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 className="section-title">
            <Pin size={18} className="pinned" />
            <span>Pinned</span>
          </h3>
          <div className="notes-grid">
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Other Notes Grid */}
      {otherNotes.length > 0 && (
        <section>
          {pinnedNotes.length > 0 && (
            <h3 className="section-title">
              <span>Others</span>
            </h3>
          )}
          <div className="notes-grid">
            {otherNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
