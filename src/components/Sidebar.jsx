import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { Sparkles, X, FileText, Tag, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const {
    notes,
    allTags,
    selectedTag,
    handleSelectTag,
    isSidebarOpen,
    setIsSidebarOpen
  } = useNotes();

  return (
    <>
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Panel */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Sparkles className="sidebar-logo-icon" size={24} />
            <span>NovaNotes</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {user && (
          <div className="user-profile">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        )}

        <nav className="nav-section">
          <span className="nav-title">Filters</span>
          <div
            className={`nav-item ${selectedTag === null ? 'active' : ''}`}
            onClick={() => handleSelectTag(null)}
          >
            <div className="nav-icon-text">
              <FileText size={18} />
              <span>All Notes</span>
            </div>
            <span className="badge">{notes.length}</span>
          </div>
        </nav>

        {allTags.length > 0 && (
          <nav className="nav-section">
            <span className="nav-title">Tags</span>
            <div className="tag-list">
              {allTags.map(tag => {
                const count = notes.filter(n => (n.tags || []).includes(tag)).length;
                return (
                  <div
                    key={tag}
                    className={`nav-item ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => handleSelectTag(tag)}
                  >
                    <div className="nav-icon-text">
                      <Tag size={16} />
                      <span>{tag}</span>
                    </div>
                    <span className="badge">{count}</span>
                  </div>
                );
              })}
            </div>
          </nav>
        )}

        <div className="logout-btn nav-item" onClick={logout}>
          <div className="nav-icon-text">
            <LogOut size={18} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>
    </>
  );
};
