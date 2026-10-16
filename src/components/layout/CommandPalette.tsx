import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Clapperboard,
  Film,
  FileText,
  Scissors,
  Layers,
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  FolderKanban,
  KeyRound,
  Settings,
  Mic,
  ArrowRight,
  Sparkles,
  Command,
  X,
} from 'lucide-react';
import { NAVIGATION_ITEMS, type NavigationPageId } from '../../navigation.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: NavigationPageId) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onExecuteCommand,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command items
  const commandItems = [
    ...NAVIGATION_ITEMS.map((item) => ({
      id: `nav-${item.id}`,
      title: item.label,
      description: item.description,
      icon: item.icon,
      category: 'Navigation',
      action: () => {
        onNavigate(item.id);
        onClose();
      },
    })),
    {
      id: 'action-new-script',
      title: 'Generate New YouTube Script',
      description: 'Open topic-to-script engine with gemini-3.8-flash',
      icon: Sparkles,
      category: 'Quick Action',
      action: () => {
        onNavigate('scripts');
        onClose();
      },
    },
    {
      id: 'action-new-source',
      title: 'Save Research Source Article',
      description: 'Add a new article, transcript, or link to library',
      icon: FileText,
      category: 'Quick Action',
      action: () => {
        onNavigate('sources');
        onClose();
      },
    },
    {
      id: 'action-open-editor',
      title: 'Open YT Editor Timeline',
      description: 'Launch multi-track video editor with real export',
      icon: Scissors,
      category: 'Quick Action',
      action: () => {
        onNavigate('yt-editor');
        onClose();
      },
    },
    {
      id: 'action-trend-radar',
      title: 'Explore Trending YouTube Niches',
      description: 'Scan viral topics & hook ideas',
      icon: TrendingUp,
      category: 'Quick Action',
      action: () => {
        onNavigate('trend-radar');
        onClose();
      },
    },
    {
      id: 'action-storyboard',
      title: 'Plan Scene Storyboard',
      description: 'Break down script into shot-by-shot visual directions',
      icon: Layers,
      category: 'Quick Action',
      action: () => {
        onNavigate('storyboard');
        onClose();
      },
    },
    {
      id: 'action-voice-audition',
      title: 'Audition Voiceover Audio',
      description: 'Listen to narration using speech synthesis',
      icon: Mic,
      category: 'Quick Action',
      action: () => {
        onNavigate('voice-audio');
        onClose();
      },
    },
    {
      id: 'action-api-keys',
      title: 'Manage Gemini API Key Credentials',
      description: 'Validate and configure AI Studio API keys',
      icon: KeyRound,
      category: 'System',
      action: () => {
        onNavigate('api-keys');
        onClose();
      },
    },
  ];

  const filtered = commandItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      } else if (query.trim() && onExecuteCommand) {
        onExecuteCommand(query.trim());
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Palette Card */}
      <div
        className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col z-10 transition-all jarvis-border-glow"
        style={{
          backgroundColor: 'rgba(9, 15, 29, 0.96)',
          borderColor: 'rgba(0, 240, 255, 0.35)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div
          className="flex items-center px-4 py-3.5 border-b"
          style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
        >
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, tool name, or topic query..."
            className="w-full bg-transparent text-sm text-cyan-50 placeholder-slate-400 focus:outline-none"
          />
          <kbd
            className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border"
            style={{
              backgroundColor: 'rgba(0, 240, 255, 0.08)',
              borderColor: 'rgba(0, 240, 255, 0.2)',
              color: '#00f0ff',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands found for &ldquo;{query}&rdquo;. Press Enter to send to JARVIS AI.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? 'border' : 'border border-transparent'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                    borderColor: isSelected ? 'rgba(0, 240, 255, 0.35)' : 'transparent',
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className="p-2 rounded-lg border text-cyan-300 flex-shrink-0"
                      style={{
                        backgroundColor: 'rgba(0, 240, 255, 0.08)',
                        borderColor: 'rgba(0, 240, 255, 0.2)',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center space-x-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-normal text-cyan-400 opacity-70">
                          • {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${
                      isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className="px-4 py-2 border-t flex items-center justify-between text-[11px] text-slate-400"
          style={{
            backgroundColor: 'rgba(4, 7, 17, 0.8)',
            borderColor: 'rgba(0, 240, 255, 0.12)',
          }}
        >
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="font-mono text-[10px] text-cyan-400">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="font-mono text-[10px] text-cyan-400">↵</kbd> select
            </span>
            <span>
              <kbd className="font-mono text-[10px] text-cyan-400">esc</kbd> close
            </span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400">JARVIS Command Engine</span>
        </div>
      </div>
    </div>
  );
};
