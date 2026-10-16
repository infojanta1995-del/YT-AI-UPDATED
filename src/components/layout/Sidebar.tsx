import React from 'react';
import { type User } from 'firebase/auth';
import {
  Cpu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  User as UserIcon,
  Sun,
  Moon,
  Sparkles,
  Command,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';
import { useTheme } from '../../theme/ThemeContext.tsx';

interface SidebarProps {
  user: User | null;
  activePage: NavigationPageId;
  onSelectPage: (id: NavigationPageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut: () => void;
  onSignIn?: () => void;
  signingOut: boolean;
  onOpenCommandPalette?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activePage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
  onSignOut,
  onSignIn,
  signingOut,
  onOpenCommandPalette,
}) => {
  const { resolvedMode, toggleMode } = useTheme();

  const coreItems = NAVIGATION_ITEMS.filter((item) => item.category === 'core' || !item.category);
  const intelligenceItems = NAVIGATION_ITEMS.filter((item) => item.category === 'intelligence');
  const systemItems = NAVIGATION_ITEMS.filter((item) => item.category === 'system');

  return (
    <aside
      className={`hidden md:flex flex-col border-r transition-all duration-300 z-30 select-none relative backdrop-blur-2xl h-screen sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        backgroundColor: 'rgba(5, 8, 17, 0.96)',
        borderColor: 'rgba(0, 240, 255, 0.16)',
      }}
    >
      {/* Sidebar Header / JARVIS Logo */}
      <div
        className="h-16 flex items-center px-4 border-b justify-between"
        style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div
            className="h-10 w-10 min-w-10 rounded-xl flex items-center justify-center text-cyan-300 shadow-lg flex-shrink-0 relative overflow-hidden border"
            style={{
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(9, 15, 29, 0.9) 70%)',
              borderColor: '#00f0ff',
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)',
            }}
          >
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-wider truncate flex items-center space-x-1.5 text-white">
                <span className="text-cyan-400">JARVIS</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  STUDIO
                </span>
              </h1>
              <p className="text-[10px] truncate text-slate-400 font-mono">
                AI YouTube Command
              </p>
            </div>
          )}
        </div>

        {/* Collapse / Expand toggle */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg border text-xs transition-colors hover:bg-slate-800/40 text-slate-400 hover:text-white cursor-pointer"
          style={{ borderColor: 'rgba(0, 240, 255, 0.15)' }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Command Palette Button */}
      {!collapsed && onOpenCommandPalette && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono border transition-all text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 cursor-pointer"
            style={{
              backgroundColor: 'rgba(9, 15, 29, 0.6)',
              borderColor: 'rgba(0, 240, 255, 0.16)',
            }}
          >
            <span className="flex items-center space-x-2">
              <Command className="w-3.5 h-3.5 text-cyan-400" />
              <span>Command Menu</span>
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Core Pipeline Section */}
        <div>
          {!collapsed && (
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase px-2 mb-1.5 opacity-80">
              CREATOR PIPELINE
            </div>
          )}
          <nav className="space-y-1">
            {coreItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                    collapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'text-white border jarvis-border-glow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.14)' : 'transparent',
                    borderColor: isActive ? 'rgba(0, 240, 255, 0.4)' : 'transparent',
                  }}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.label}</span>
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
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Section */}
        <div>
          {!collapsed && (
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase px-2 mb-1.5 opacity-80">
              INTELLIGENCE
            </div>
          )}
          <nav className="space-y-1">
            {intelligenceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                    collapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'text-white border jarvis-border-glow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.14)' : 'transparent',
                    borderColor: isActive ? 'rgba(0, 240, 255, 0.4)' : 'transparent',
                  }}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ml-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Settings Section */}
        <div>
          {!collapsed && (
            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 mb-1.5">
              SYSTEM
            </div>
          )}
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                    collapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-3'
                  } ${
                    isActive
                      ? 'text-white border jarvis-border-glow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.14)' : 'transparent',
                    borderColor: isActive ? 'rgba(0, 240, 255, 0.4)' : 'transparent',
                  }}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Auth */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
      >
        {user ? (
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center space-x-2 px-1">
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                  }}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {user.displayName || 'Creator'}
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate font-mono">
                    Firestore Cloud Sync
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={onSignOut}
              disabled={signingOut}
              className={`w-full flex items-center rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer ${
                collapsed ? 'justify-center p-2' : 'px-3 py-1.5 space-x-2'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>}
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={onSignIn}
              className={`w-full flex items-center rounded-xl text-xs font-bold text-black shadow-md transition-all hover:opacity-90 cursor-pointer ${
                collapsed ? 'justify-center p-2' : 'px-3 py-2 space-x-2'
              }`}
              style={{ backgroundColor: '#00f0ff' }}
            >
              <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <span>Sign In (Google)</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
