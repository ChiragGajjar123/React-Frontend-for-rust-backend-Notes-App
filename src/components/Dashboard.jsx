import React from 'react';
import { NotesProvider, useNotes } from '../context/NotesContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotesList } from './NotesList';
import { NoteModal } from './NoteModal';
import { AlertCircle } from 'lucide-react';

const DashboardContent = () => {
  const { error } = useNotes();

  return (
    <div className="dashboard">
      <Sidebar />

      {/* Main Panel Content */}
      <main className="main-content">
        <Header />

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <NotesList />
      </main>

      {/* Editor Modal Popup */}
      <NoteModal />
    </div>
  );
};

export const Dashboard = () => {
  return (
    <NotesProvider>
      <DashboardContent />
    </NotesProvider>
  );
};
