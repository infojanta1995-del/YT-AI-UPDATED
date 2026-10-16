import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { Sidebar } from './Sidebar.tsx';
import { MobileDrawer } from './MobileDrawer.tsx';
import { TopBar } from './TopBar.tsx';
import { CommandPalette } from './CommandPalette.tsx';
import { JarvisAssistantPanel } from './JarvisAssistantPanel.tsx';
import { SpaceBackground } from '../background/SpaceBackground.tsx';
import { type NavigationPageId } from '../../navigation.ts';
import { type ScriptGenerationResponse } from '../../services/api.ts';

interface AppLayoutProps {
  user: User | null;
  activePage: NavigationPageId;
  activeProjectTitle?: string;
  currentScript?: ScriptGenerationResponse | null;
  scriptSourceTitle?: string;
  onSelectPage: (id: NavigationPageId) => void;
  onSignOut: () => void;
  onSignIn?: () => void;
  signingOut: boolean;
  onExecuteCommand?: (cmd: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  activePage,
  activeProjectTitle = 'Quantum Computing Microchips 2nm',
  currentScript,
  scriptSourceTitle,
  onSelectPage,
  onSignOut,
  onSignIn,
  signingOut,
  onExecuteCommand,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen flex relative overflow-x-hidden transition-colors"
      style={{
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Cinematic Ambient Background */}
      <SpaceBackground />

      {/* 2. Desktop Left Navigation Rail */}
      <Sidebar
        user={user}
        activePage={activePage}
        onSelectPage={onSelectPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
        signingOut={signingOut}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* 3. Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        user={user}
        activePage={activePage}
        onSelectPage={onSelectPage}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
        signingOut={signingOut}
      />

      {/* 4. Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={onSelectPage}
        onExecuteCommand={onExecuteCommand}
      />

      {/* 5. Contextual Right-Side JARVIS Copilot */}
      <JarvisAssistantPanel
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        activePage={activePage}
        currentScript={currentScript}
        scriptSourceTitle={scriptSourceTitle}
        onNavigate={onSelectPage}
      />

      {/* 6. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <TopBar
          user={user}
          activePage={activePage}
          activeProjectTitle={activeProjectTitle}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleAssistant={() => setAssistantOpen(!assistantOpen)}
          assistantOpen={assistantOpen}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
