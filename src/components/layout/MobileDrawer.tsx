import React from 'react';
import { type User } from 'firebase/auth';
import {
  Cpu,
  X,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  activePage: NavigationPageId;
  onSelectPage: (id: NavigationPageId) => void;
  onSignOut: () => void;
  onSignIn?: () => void;
  signingOut: boolean;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  activePage,
  onSelectPage,
  onSignOut,
  onSignIn,
  signingOut,
}) => {
  const { resolvedMode, toggleMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className="relative w-72 max-w-[85vw] h-full flex flex-col shadow-2xl border-r z-10 animate-in slide-in-from-left duration-200"
        style={{
          backgroundColor: 'rgba(5, 8, 17, 0.98)',
          borderColor: 'rgba(0, 240, 255, 0.2)',
        }}
      >
        {/* Drawer Header */}
        <div
          className="h-16 flex items-center px-4 border-b justify-between"
          style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-cyan-300 shadow border"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderColor: '#00f0ff',
              }}
            >
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs font-black flex items-center space-x-1.5 text-white">
                <span className="text-cyan-400">JARVIS</span>
                <span className="px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  STUDIO
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                AI YouTube Command
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border text-xs cursor-pointer text-slate-400 hover:text-white"
            style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'text-white border jarvis-border-glow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
                style={{
                  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                  borderColor: isActive ? '#00f0ff' : 'transparent',
                }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-cyan-300' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ml-1 ${
                      item.badge === 'NEW'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
        >
          {user ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-white truncate">
                {user.displayName || user.email}
              </div>
              <button
                onClick={onSignOut}
                disabled={signingOut}
                className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold text-black shadow-md cursor-pointer"
              style={{ backgroundColor: '#00f0ff' }}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
