import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const { user, logout, updateTheme } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Per-note busy tracking (pin / delete)
  const [pinningIds, setPinningIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Modal save busy state
  const [modalSaving, setModalSaving] = useState(false);

  // Theme preference derived from user profile database value
  const isDarkMode = user?.theme === 'dark';
  const [themeSaving, setThemeSaving] = useState(false);

  const toggleTheme = async () => {
    if (themeSaving) return;
    setThemeSaving(true);
    try {
      await updateTheme(isDarkMode ? 'light' : 'dark');
    } finally {
      setThemeSaving(false);
    }
  };

  // Mobile sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null); // null means All Notes

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setIsSidebarOpen(false);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null means Creating Note
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: [],
    color: 'slate',
    pinned: false
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch Notes
  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
      } else {
        setError('Could not load notes. Please verify your database connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);


  // Filter notes by search query and tag
  const filteredNotes = notes.filter(note => {
    const matchesTag = selectedTag ? (note.tags || []).includes(selectedTag) : true;
    const matchesSearch = searchQuery.trim() === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (note.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  // Extract unique tags across all notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  ).sort();

  // Pin / Unpin Note Toggle
  const handleTogglePin = async (e, note) => {
    e.stopPropagation();
    if (pinningIds.has(note.id)) return;
    setPinningIds(prev => new Set(prev).add(note.id));
    try {
      const updated = { ...note, pinned: !note.pinned };
      const result = await api.updateNote(note.id, updated);
      setNotes(notes.map(n => n.id === note.id ? result : n));
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
      } else {
        setError('Failed to update pin status.');
      }
    } finally {
      setPinningIds(prev => { const s = new Set(prev); s.delete(note.id); return s; });
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setNoteForm({
      title: '',
      content: '',
      tags: [],
      color: 'slate',
      pinned: false
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: [...(note.tags || [])],
      color: note.color || 'slate',
      pinned: note.pinned || false
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Delete Note
  const handleDeleteNote = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    if (deletingIds.has(id)) return;
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
      } else {
        setError('Failed to delete the note.');
      }
    } finally {
      setDeletingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim() && !noteForm.content.trim()) {
      alert('Note cannot be completely empty.');
      return;
    }
    setModalSaving(true);
    try {
      let result;
      if (editingNote) {
        result = await api.updateNote(editingNote.id, noteForm);
        setNotes(notes.map(n => n.id === editingNote.id ? result : n));
      } else {
        result = await api.createNote(noteForm);
        setNotes([result, ...notes].sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }));
      }
      setIsModalOpen(false);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
      } else {
        alert('Failed to save the note.');
      }
    } finally {
      setModalSaving(false);
    }
  };

  // Tag Manager: Add Tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !noteForm.tags.includes(trimmed)) {
      setNoteForm({
        ...noteForm,
        tags: [...noteForm.tags, trimmed]
      });
    }
    setTagInput('');
  };

  // Tag Manager: Remove Tag
  const handleRemoveTag = (tagToRemove) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter(t => t !== tagToRemove)
    });
  };

  // Render Date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Split into Pinned and Other Notes
  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <NotesContext.Provider value={{
      notes,
      loading,
      error,
      pinningIds,
      deletingIds,
      modalSaving,
      isDarkMode,
      themeSaving,
      isSidebarOpen,
      setIsSidebarOpen,
      searchQuery,
      setSearchQuery,
      selectedTag,
      setSelectedTag,
      handleSelectTag,
      isModalOpen,
      setIsModalOpen,
      editingNote,
      setEditingNote,
      noteForm,
      setNoteForm,
      tagInput,
      setTagInput,
      fetchNotes,
      filteredNotes,
      allTags,
      pinnedNotes,
      otherNotes,
      handleTogglePin,
      handleOpenCreateModal,
      handleOpenEditModal,
      handleDeleteNote,
      handleFormSubmit,
      handleAddTag,
      handleRemoveTag,
      formatDate,
      toggleTheme
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
