import React from 'react';
import { useNotes } from '../context/NotesContext';
import { Menu, Search, Sun, Moon, Plus } from 'lucide-react';
import { Spinner } from './Spinner';

export const Header = () => {
  const {
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery,
    themeSaving,
    toggleTheme,
    isDarkMode,
    handleOpenCreateModal
  } = useNotes();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search title, tags, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        <button
          className={`icon-btn${themeSaving ? ' btn-loading' : ''}`}
          onClick={toggleTheme}
          disabled={themeSaving}
          title={themeSaving ? 'Saving theme…' : isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {themeSaving ? (
            <Spinner size={20} color="currentColor" />
          ) : isDarkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
        <button className="btn-add-note" onClick={handleOpenCreateModal}>
          <Plus size={20} />
          <span>New Note</span>
        </button>
      </div>
    </header>
  );
};
