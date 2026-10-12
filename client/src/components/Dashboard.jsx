import React, { useState, useEffect } from 'react';
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

  // Data stores initialized from profile
  const [contentItems, setContentItems] = useState([]);
  const [collectedInbox, setCollectedInbox] = useState([]);
  const [agentMemory, setAgentMemory] = useState([]);

  // Modals & Navigation intents
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [selectedContentItem, setSelectedContentItem] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [museInitialPrompt, setMuseInitialPrompt] = useState('');

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

  // Content Pipeline Handlers
  const handleUpdateContentItem = (updatedItem) => {
    setContentItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleAddContentItem = (newItem) => {
    setContentItems(prev => [newItem, ...prev]);
  };

  const handleDeleteContentItem = (itemId) => {
    setContentItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleOpenContentModal = (item) => {
    setSelectedContentItem(item);
    setIsContentModalOpen(true);
  };

  // Quick Capture Idea handler
  const handleSaveIdea = (newIdea) => {
    setCollectedInbox(prev => [newIdea, ...prev]);
  };

  // Memory handlers
  const handleAddMemoryNote = (newNote) => {
    setAgentMemory(prev => [newNote, ...prev]);
  };

  const handleDeleteMemoryNote = (noteId) => {
    setAgentMemory(prev => prev.filter(m => m.id !== noteId));
  };

  // Inter-page Navigation Actions
  const handleNavigateToMuse = (prompt = '') => {
    setMuseInitialPrompt(prompt);
    setActivePage('muse');
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
        onRestartOnboarding={onRestartOnboarding}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-16 overflow-y-auto">
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
            onAddContentToStudio={handleAddContentItem}
            onNavigateToStudio={() => setActivePage('studio')}
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
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          />
        )}

        {activePage === 'you' && (
          <YouView
            profile={profile}
            agentMemory={agentMemory}
            onAddMemoryNote={handleAddMemoryNote}
            onDeleteMemoryNote={handleDeleteMemoryNote}
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
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
