import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import Navigation from './Navigation';
import OverviewView from './OverviewView';
import MuseView from './MuseView';
import StudioView from './StudioView';
import YouView from './YouView';
import QuickCaptureModal from './QuickCaptureModal';
import ContentDetailModal from './ContentDetailModal';
import AuthModal from './AuthModal';
import { getInitialStudioData } from '../data/initialStudioData';
import { 
  subscribeToAuth, 
  saveFounderProfile, 
  saveContentStudioItems, 
  saveAgentMemoryItems 
} from '../firebase';

export default function Dashboard({ 
  profile, 
  currentProfileId, 
  onSwitchProfile, 
  onRestartOnboarding,
  activePage: propActivePage,
  onPageChange
}) {
  const [internalPage, setInternalPage] = useState('overview');
  const activePage = propActivePage || internalPage;
  const setActivePage = onPageChange || setInternalPage;
  
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Data stores initialized synchronously from profile
  const [contentItems, setContentItems] = useState(() => getInitialStudioData(profile).contentItems);
  const [collectedInbox, setCollectedInbox] = useState(() => getInitialStudioData(profile).collectedInbox);
  const [agentMemory, setAgentMemory] = useState(() => getInitialStudioData(profile).agentMemory);

  // Modals & Navigation intents
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [selectedContentItem, setSelectedContentItem] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [museInitialPrompt, setMuseInitialPrompt] = useState('');

  // Main scroll container ref
  const mainRef = React.useRef(null);

  // Reset scroll to top cleanly whenever activePage changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activePage]);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Re-initialize data when active profile changes
  useEffect(() => {
    const initialData = getInitialStudioData(profile);
    setContentItems(initialData.contentItems);
    setCollectedInbox(initialData.collectedInbox);
    setAgentMemory(initialData.agentMemory);

    // If user is authenticated, sync to Firestore
    if (currentUser?.uid) {
      saveFounderProfile(currentUser.uid, profile).catch(console.error);
    }
  }, [profile?.founder_id, currentUser?.uid]);

  // Universal Toast Notification System
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Content Pipeline Handlers
  const handleUpdateContentItem = (updatedItem) => {
    setContentItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    if (activeNoteContext?.id === updatedItem.id) {
      setActiveNoteContext(updatedItem);
    }
    showToast(`✓ Saved "${updatedItem.title || 'Note'}"`);
  };

  const handleAddContentItem = (newItem) => {
    setContentItems(prev => [newItem, ...prev]);
    showToast(`✓ Added "${newItem.title || 'New item'}" to Board & Calendar`);
  };

  const handleDeleteContentItem = (itemId) => {
    const itemToDelete = contentItems.find(item => item.id === itemId);
    const title = itemToDelete?.title || 'Note';
    setContentItems(prev => prev.filter(item => item.id !== itemId));
    if (activeNoteContext?.id === itemId) {
      setActiveNoteContext(null);
    }
    showToast(`✓ Removed "${title}" from Board & Calendar`);
  };

  const handleOpenContentModal = (item) => {
    setSelectedContentItem(item);
    setIsContentModalOpen(true);
  };

  // Quick Capture Idea handler
  const handleSaveIdea = (newIdea) => {
    setCollectedInbox(prev => [newIdea, ...prev]);
    showToast(`✓ Captured note "${newIdea.title || 'Idea'}"`);
  };

  // Memory handlers
  const handleAddMemoryNote = (newNote) => {
    setAgentMemory(prev => [newNote, ...prev]);
  };

  const handleDeleteMemoryNote = (noteId) => {
    setAgentMemory(prev => prev.filter(m => m.id !== noteId));
  };

  const [activeNoteContext, setActiveNoteContext] = useState(null);

  // Inter-page Navigation Actions
  const handleNavigateToMuse = (prompt = '', noteItem = null) => {
    setMuseInitialPrompt(prompt || '');
    setActiveNoteContext(noteItem || null);
    setActivePage('muse');
  };

  const handleTransferNoteToCalendar = (noteItem, targetDay = 'Wednesday') => {
    if (!noteItem) return;
    const updated = {
      ...noteItem,
      day: targetDay,
      stage: noteItem.stage === 'idea' ? 'draft' : noteItem.stage
    };
    setContentItems(prev => prev.map(item => item.id === updated.id ? updated : item));
    if (activeNoteContext?.id === noteItem.id) {
      setActiveNoteContext(updated);
    }
    showToast(`✓ Scheduled "${noteItem.title || 'Note'}" for ${targetDay} on Calendar`);
    return updated;
  };

  const handleNavigateToStudio = (itemId = null) => {
    setActivePage('studio');
    if (itemId) {
      const targetItem = contentItems.find(i => i.id === itemId);
      if (targetItem) {
        setSelectedContentItem(targetItem);
        setIsContentModalOpen(true);
      }
    }
  };

  const handleNavigateToYou = () => {
    setActivePage('you');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col md:flex-row selection:bg-[#FEEC98] selection:text-slate-950">
      
      {/* Vertical Side Menu */}
      <Navigation
        activePage={activePage}
        setActivePage={setActivePage}
        profile={profile}
        currentProfileId={currentProfileId}
        onSwitchProfile={onSwitchProfile}
        onRestartOnboarding={onRestartOnboarding}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main ref={mainRef} className={`flex-1 min-w-0 ${activePage === 'muse' ? 'h-screen overflow-hidden' : 'pb-20 md:pb-16 overflow-y-auto'}`}>
        {activePage === 'overview' && (
          <OverviewView
            profile={profile}
            contentItems={contentItems}
            onNavigateToMuse={handleNavigateToMuse}
            onNavigateToStudio={handleNavigateToStudio}
            onNavigateToYou={handleNavigateToYou}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          />
        )}

        {activePage === 'muse' && (
          <MuseView
            profile={profile}
            initialPrompt={museInitialPrompt}
            activeNote={activeNoteContext}
            onClearActiveNote={() => setActiveNoteContext(null)}
            onUpdateContentItem={handleUpdateContentItem}
            onDeleteContentItem={handleDeleteContentItem}
            onTransferToCalendar={handleTransferNoteToCalendar}
            onAddContentToStudio={handleAddContentItem}
            onNavigateToStudio={() => setActivePage('studio')}
            showToast={showToast}
          />
        )}

        {activePage === 'studio' && (
          <StudioView
            profile={profile}
            contentItems={contentItems}
            collectedInbox={collectedInbox}
            onUpdateContentItem={handleUpdateContentItem}
            onAddContentItem={handleAddContentItem}
            onDeleteContentItem={handleDeleteContentItem}
            onOpenContentModal={handleOpenContentModal}
            onOpenInMuse={handleNavigateToMuse}
            onTransferToCalendar={handleTransferNoteToCalendar}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            showToast={showToast}
          />
        )}

        {activePage === 'you' && (
          <YouView
            profile={profile}
            agentMemory={agentMemory}
            onAddMemoryNote={handleAddMemoryNote}
            onDeleteMemoryNote={handleDeleteMemoryNote}
            onRestartOnboarding={onRestartOnboarding}
          />
        )}
      </main>

      {/* Universal Modals */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSaveIdea={handleSaveIdea}
        onDevelopWithMuse={(idea) => {
          handleNavigateToMuse(`Develop this raw thought into a calibrated post:\n\nTitle: ${idea.title}\nSnippet: ${idea.snippet}`);
        }}
      />

      <ContentDetailModal
        item={selectedContentItem}
        isOpen={isContentModalOpen}
        onClose={() => {
          setIsContentModalOpen(false);
          setSelectedContentItem(null);
        }}
        onUpdateItem={handleUpdateContentItem}
        onDeleteItem={handleDeleteContentItem}
        onOpenInMuse={handleNavigateToMuse}
        showToast={showToast}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
      />

      {/* Universal Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-700/80 backdrop-blur-md animate-fade-in pointer-events-none">
          <Icon name="check_circle" size={15} className="text-[#FFCC00]" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
