import React from 'react';
import { type User } from 'firebase/auth';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  LogIn,
  Search,
  Bot,
  HardDrive,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface TopBarProps {
  user: User | null;
  activePage: NavigationPageId;
  activeProjectTitle?: string;
  onOpenMobileDrawer: () => void;
  onOpenCommandPalette?: () => void;
  onToggleAssistant?: () => void;
  assistantOpen?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  activePage,
  activeProjectTitle = 'Active Creator Project',
  onOpenMobileDrawer,
  onOpenCommandPalette,
  onToggleAssistant,
  assistantOpen = false,
  onSignIn,
}) => {
  const { resolvedMode, toggleMode } = useTheme();
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activePage) || NAVIGATION_ITEMS[0];

  return (
    <header
      className="h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-2xl transition-colors"
      style={{
        backgroundColor: 'rgba(5, 8, 17, 0.88)',
        borderColor: 'rgba(0, 240, 255, 0.16)',
      }}
    >
      {/* Left: Mobile Menu + Active Module & Project Breadcrumb */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileDrawer}
          className="md:hidden p-2 rounded-xl border text-xs cursor-pointer text-slate-300 hover:text-white"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.8)',
            borderColor: 'rgba(0, 240, 255, 0.2)',
          }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold tracking-wider">JARVIS</span>
            <span>/</span>
            <span className="truncate max-w-[120px] sm:max-w-[180px] text-slate-300">
              {activeProjectTitle}
            </span>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{currentItem.label}</span>
          </h1>
        </div>
      </div>

      {/* Center: Search & Command Palette trigger (Desktop) */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.7)',
            borderColor: 'rgba(0, 240, 255, 0.15)',
          }}
        >
          <span className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search tools, scripts, topics...</span>
          </span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Model Badge, Cloud Sync status, Assistant Copilot Button */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real AI Model Indicator */}
        <div
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.7)',
            borderColor: 'rgba(0, 240, 255, 0.2)',
            color: '#8be9fd',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>gemini-3.8-flash</span>
        </div>

        {/* Sync Status Badge */}
        <div
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.6)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            color: '#34d399',
          }}
          title={user ? 'Synced with Firestore Cloud' : 'Saved in Browser Storage'}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{user ? 'Cloud Sync' : 'Local Draft'}</span>
        </div>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="lg:hidden p-2 rounded-xl border text-slate-300 hover:text-cyan-400 cursor-pointer"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.7)',
            borderColor: 'rgba(0, 240, 255, 0.2)',
          }}
          title="Search / Command Palette"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* JARVIS Assistant Copilot Slide-over Button */}
        {onToggleAssistant && (
          <button
            onClick={onToggleAssistant}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              assistantOpen
                ? 'bg-cyan-400 text-black border-cyan-400 shadow-lg'
                : 'text-cyan-300 hover:bg-cyan-500/10'
            }`}
            style={{
              backgroundColor: assistantOpen ? '#00f0ff' : 'rgba(0, 240, 255, 0.08)',
              borderColor: assistantOpen ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)',
            }}
            title="Toggle JARVIS Copilot"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Copilot</span>
          </button>
        )}

        {/* Theme mode toggle */}
        <button
          onClick={toggleMode}
          title={`Switch to ${resolvedMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl border text-slate-300 hover:text-white transition-colors cursor-pointer"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.7)',
            borderColor: 'rgba(0, 240, 255, 0.2)',
          }}
          aria-label="Toggle theme mode"
        >
          {resolvedMode === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-300" />}
        </button>

        {/* Sign In button for guest users */}
        {!user && onSignIn && (
          <button
            onClick={onSignIn}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-black shadow-md hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#00f0ff' }}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
