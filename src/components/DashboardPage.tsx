import React, { useState, useRef, useEffect } from 'react';
import { type User } from 'firebase/auth';
import {
  Clapperboard,
  Film,
  Search,
  Image as ImageIcon,
  Scissors,
  FileText,
  KeyRound,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  HardDrive,
  LogIn,
  Settings,
  Layers,
  Mic,
  MicOff,
  Send,
  TrendingUp,
  Calendar,
  FolderKanban,
  Cpu,
  Volume2,
  Play,
  RotateCcw,
} from 'lucide-react';
import { logOut } from '../services/firebase.ts';
import { DriveStatusCard } from './DriveStatusCard.tsx';
import { GeminiConfigCard } from './GeminiConfigCard.tsx';
import { SourcesTab } from './SourcesTab.tsx';
import { ScriptGeneratorTab } from './ScriptGeneratorTab.tsx';
import { VideoPromptBuilderTab } from './VideoPromptBuilderTab.tsx';
import { SEOStudioTab } from './SEOStudioTab.tsx';
import { ThumbnailStudioTab } from './ThumbnailStudioTab.tsx';
import { YTEditorTab } from './YTEditorTab.tsx';
import { SettingsPage } from './SettingsPage.tsx';
import { StoryboardTab } from './StoryboardTab.tsx';
import { VoiceAudioStudioTab } from './VoiceAudioStudioTab.tsx';
import { TrendRadarTab } from './TrendRadarTab.tsx';
import { ContentCalendarTab } from './ContentCalendarTab.tsx';
import { ProjectLibraryTab, type CreatorProject } from './ProjectLibraryTab.tsx';
import { JarvisReactorCore, type JarvisCoreState } from './jarvis/JarvisReactorCore.tsx';
import { AppLayout } from './layout/AppLayout.tsx';
import { type NavigationPageId } from '../navigation.ts';
import { type ScriptGenerationResponse } from '../services/api.ts';

interface DashboardPageProps {
  user: User | null;
  onSignOut: () => void;
  onSignIn?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onSignOut, onSignIn }) => {
  const [activePage, setActivePage] = useState<NavigationPageId>('overview');
  const [driveConnected, setDriveConnected] = useState<boolean>(false);
  const [signingOut, setSigningOut] = useState<boolean>(false);

  const effectiveUserId = user ? user.uid : 'local_creator';

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logOut();
      onSignOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  // Active Project & Transfer Pipeline State
  const [activeProjectTitle, setActiveProjectTitle] = useState<string>('Quantum Computing Microchips 2nm');
  const [selectedScriptSourceId, setSelectedScriptSourceId] = useState<string | null>(null);

  const handleSelectSourceForScript = (sourceId: string) => {
    setSelectedScriptSourceId(sourceId);
    setActivePage('scripts');
  };

  const [transferredScript, setTransferredScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredSourceTitle, setTransferredSourceTitle] = useState<string>('Quantum Computing Microchips 2nm');

  const handleTransferToVideoPrompts = (scriptData: ScriptGenerationResponse, sourceTitle?: string) => {
    setTransferredScript(scriptData);
    setTransferredSourceTitle(sourceTitle || `${scriptData.contentMode} Video Script`);
    setActivePage('video-prompts');
  };

  const [transferredSEOScript, setTransferredSEOScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredSEOSourceTitle, setTransferredSEOSourceTitle] = useState<string>('');
  const [transferredSEOSourceArticle, setTransferredSEOSourceArticle] = useState<string>('');

  const handleTransferToSEOStudio = (
    scriptData: ScriptGenerationResponse,
    sourceTitle?: string,
    sourceArticle?: string,
  ) => {
    setTransferredSEOScript(scriptData);
    setTransferredSEOSourceTitle(sourceTitle || `${scriptData.contentMode} Video Script`);
    setTransferredSEOSourceArticle(sourceArticle || '');
    setActivePage('seo-studio');
  };

  const [transferredThumbScript, setTransferredThumbScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredThumbSourceTitle, setTransferredThumbSourceTitle] = useState<string>('');
  const [transferredThumbSourceArticle, setTransferredThumbSourceArticle] = useState<string>('');
  const [transferredThumbConcept, setTransferredThumbConcept] = useState<any>(null);

  const handleTransferToThumbnailStudio = (params: {
    script?: ScriptGenerationResponse | null;
    sourceTitle?: string;
    sourceArticle?: string;
    concept?: any;
  }) => {
    if (params.script) setTransferredThumbScript(params.script);
    if (params.sourceTitle) setTransferredThumbSourceTitle(params.sourceTitle);
    if (params.sourceArticle) setTransferredThumbSourceArticle(params.sourceArticle);
    if (params.concept) setTransferredThumbConcept(params.concept);
    setActivePage('thumbnail-studio');
  };

  const [transferredEditorScript, setTransferredEditorScript] = useState<ScriptGenerationResponse | null>(null);
  const [transferredEditorSourceTitle, setTransferredEditorSourceTitle] = useState<string>('');

  const handleTransferToYTEditor = (script?: ScriptGenerationResponse | null, sourceTitle?: string) => {
    if (script) setTransferredEditorScript(script);
    if (sourceTitle) setTransferredEditorSourceTitle(sourceTitle);
    setActivePage('yt-editor');
  };

  // Project selection from Project Library
  const handleSelectProject = (project: CreatorProject) => {
    setActiveProjectTitle(project.title);
    if (project.script) {
      setTransferredScript(project.script);
      setTransferredSourceTitle(project.title);
    }
    setActivePage('scripts');
  };

  // Trend selection from Trend Radar
  const handleSelectTrendForScript = (trend: { topic: string; mode: string; angle: string }) => {
    setActiveProjectTitle(trend.topic);
    setActivePage('scripts');
  };

  // JARVIS Command Interface & Voice Recognition State
  const [commandInput, setCommandInput] = useState<string>('');
  const [jarvisCoreState, setJarvisCoreState] = useState<JarvisCoreState>('idle');
  const [jarvisFeedback, setJarvisFeedback] = useState<string>('Online • Standing by for instructions');
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsVoiceListening(true);
          setJarvisCoreState('listening');
          setJarvisFeedback('Listening to voice input...');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setCommandInput(transcript);
        };

        recognition.onerror = () => {
          setIsVoiceListening(false);
          setJarvisCoreState('idle');
          setJarvisFeedback('Microphone input ended.');
        };

        recognition.onend = () => {
          setIsVoiceListening(false);
          setJarvisCoreState('idle');
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const handleToggleVoice = () => {
    if (!speechRecognitionRef.current) {
      setJarvisFeedback('Microphone API not supported in this browser. Please type commands below.');
      return;
    }

    if (isVoiceListening) {
      speechRecognitionRef.current.stop();
      setIsVoiceListening(false);
      setJarvisCoreState('idle');
    } else {
      try {
        speechRecognitionRef.current.start();
      } catch {
        // Already started or busy
      }
    }
  };

  // Intelligent Command Router
  const handleExecuteCommand = (rawCommand: string) => {
    const cmd = rawCommand.toLowerCase().trim();
    if (!cmd) return;

    setJarvisCoreState('processing');
    setJarvisFeedback(`Routing command: "${rawCommand}"`);

    setTimeout(() => {
      if (cmd.includes('script') || cmd.includes('write') || cmd.includes('generate')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Script Generator engine.');
        setActivePage('scripts');
      } else if (cmd.includes('storyboard') || cmd.includes('scene') || cmd.includes('shot')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Storyboard & Scene Planner.');
        setActivePage('storyboard');
      } else if (cmd.includes('prompt') || cmd.includes('veo') || cmd.includes('flow')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Video Prompt Builder.');
        setActivePage('video-prompts');
      } else if (cmd.includes('thumbnail') || cmd.includes('thumb') || cmd.includes('image')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Thumbnail Studio.');
        setActivePage('thumbnail-studio');
      } else if (cmd.includes('seo') || cmd.includes('tag') || cmd.includes('title') || cmd.includes('metadata')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening SEO Studio.');
        setActivePage('seo-studio');
      } else if (cmd.includes('edit') || cmd.includes('timeline') || cmd.includes('cut') || cmd.includes('video')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening YT Editor Timeline.');
        setActivePage('yt-editor');
      } else if (cmd.includes('voice') || cmd.includes('audio') || cmd.includes('narration') || cmd.includes('sound')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Voice & Audio Studio.');
        setActivePage('voice-audio');
      } else if (cmd.includes('trend') || cmd.includes('radar') || cmd.includes('viral')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Scanning Trend Radar topics.');
        setActivePage('trend-radar');
      } else if (cmd.includes('calendar') || cmd.includes('schedule') || cmd.includes('deadline')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Content Calendar.');
        setActivePage('calendar');
      } else if (cmd.includes('project') || cmd.includes('library') || cmd.includes('archive')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Project Library.');
        setActivePage('projects');
      } else if (cmd.includes('source') || cmd.includes('research') || cmd.includes('article')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening Research & Sources.');
        setActivePage('sources');
      } else if (cmd.includes('api') || cmd.includes('key') || cmd.includes('config') || cmd.includes('settings')) {
        setJarvisCoreState('completed');
        setJarvisFeedback('Opening API Settings.');
        setActivePage('api-keys');
      } else {
        // General command fallback
        setJarvisCoreState('completed');
        setJarvisFeedback(`Interpreted topic: "${rawCommand}". Opening Script Generator.`);
        setActiveProjectTitle(rawCommand);
        setActivePage('scripts');
      }
      setCommandInput('');
    }, 450);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    handleExecuteCommand(commandInput);
  };

  return (
    <AppLayout
      user={user}
      activePage={activePage}
      activeProjectTitle={activeProjectTitle}
      currentScript={transferredScript}
      scriptSourceTitle={transferredSourceTitle}
      onSelectPage={setActivePage}
      onSignOut={handleSignOut}
      onSignIn={onSignIn}
      signingOut={signingOut}
      onExecuteCommand={handleExecuteCommand}
    >
      {/* 1. OVERVIEW PAGE — JARVIS Central AI Command Center */}
      {activePage === 'overview' && (
        <div className="space-y-8">
          {/* JARVIS Central Reactor Core & Command Hero */}
          <section
            className="p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden jarvis-panel"
            style={{
              borderColor: 'rgba(0, 240, 255, 0.28)',
            }}
          >
            {/* Ambient Corner HUD Markers */}
            <div className="absolute top-3 left-3 text-[9px] font-mono text-cyan-400 opacity-60">
              SYS//ONLINE: 100%
            </div>
            <div className="absolute top-3 right-3 text-[9px] font-mono text-cyan-400 opacity-60">
              CORE//GEMINI-3.8-FLASH
            </div>

            <div className="flex flex-col items-center text-center space-y-6 relative z-10 max-w-3xl mx-auto">
              {/* Animated JARVIS Reactor Visualization */}
              <JarvisReactorCore
                state={jarvisCoreState}
                statusText={jarvisFeedback}
                isListening={isVoiceListening}
                onToggleMic={handleToggleVoice}
                size="md"
              />

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
                  <span>Good evening. What are we creating today?</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  JARVIS AI Creator Studio coordinates your complete YouTube pipeline from research and voiceover scripting to storyboards, prompt synthesis, and timeline video assembly.
                </p>
              </div>

              {/* Natural Language & Voice Command Input */}
              <form onSubmit={handleCommandSubmit} className="w-full max-w-2xl relative">
                <div
                  className="flex items-center px-4 py-3 rounded-2xl border transition-all jarvis-border-glow shadow-2xl"
                  style={{
                    backgroundColor: 'rgba(9, 15, 29, 0.95)',
                    borderColor: 'rgba(0, 240, 255, 0.35)',
                  }}
                >
                  <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter command (e.g. 'Generate Hindi script on Quantum Computing', 'Open Storyboard')..."
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                  <div className="flex items-center space-x-1.5 ml-2">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isVoiceListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'text-cyan-400 hover:bg-cyan-500/10'
                      }`}
                      title={isVoiceListening ? 'Stop Listening' : 'Voice Command with Microphone'}
                    >
                      {isVoiceListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="submit"
                      disabled={!commandInput.trim()}
                      className="p-2 rounded-xl text-black font-bold disabled:opacity-40 transition-all cursor-pointer shadow-md"
                      style={{ backgroundColor: '#00f0ff' }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Command Prompt Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-400 font-mono text-[10px] mr-1">QUICK ACTIONS:</span>
                {[
                  { label: 'Generate Hindi Script', cmd: 'Generate Hindi YouTube Shorts script' },
                  { label: 'Plan Storyboard', cmd: 'Create a storyboard for my active script' },
                  { label: 'Google Flow Prompts', cmd: 'Build complete video prompts' },
                  { label: 'High-CTR Thumbnails', cmd: 'Generate thumbnail concepts' },
                  { label: 'YouTube SEO Tags', cmd: 'Prepare SEO tags and description' },
                  { label: 'Launch YT Editor', cmd: 'Open multi-track video editor timeline' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleExecuteCommand(chip.cmd)}
                    className="px-3 py-1 rounded-xl border border-cyan-500/20 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Active Workspace Project HUD Bar */}
          <section
            className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
          >
            <div className="flex items-center space-x-3.5">
              <div
                className="p-3 rounded-xl border text-cyan-300 flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.08)',
                  borderColor: 'rgba(0, 240, 255, 0.25)',
                }}
              >
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                    CURRENT ACTIVE PROJECT
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Session
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white">
                  {activeProjectTitle}
                </h2>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  AI Model: <span className="text-cyan-300 font-semibold">gemini-3.8-flash</span> • Storage:{' '}
                  <span className="text-emerald-400">{user ? 'Firestore Cloud Sync' : 'Local Storage'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActivePage('scripts')}
                className="px-4 py-2 rounded-xl font-bold text-xs text-black shadow-md hover:opacity-90 transition-all cursor-pointer flex items-center space-x-1.5"
                style={{ backgroundColor: '#00f0ff' }}
              >
                <Clapperboard className="w-3.5 h-3.5" />
                <span>Continue In Script Generator &rarr;</span>
              </button>
            </div>
          </section>

          {/* Core Creator Pipeline Grid (8 Modules) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Connected Production Pipeline</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                    8 STUDIOS
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Engineered sequence connecting verified research to scriptwriting, storyboard direction, prompts, and timeline editing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Sources */}
              <div
                onClick={() => setActivePage('sources')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Step 1
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Research & Sources
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Store research articles, transcripts, news, and plain text notes with cloud sync.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Library &rarr;</span>
                </div>
              </div>

              {/* Card 2: Script Generator */}
              <div
                onClick={() => setActivePage('scripts')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                      <Clapperboard className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      Step 2
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Script Generator
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate from user topics or saved sources with 12 content modes and 4 languages.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-red-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Script Engine &rarr;</span>
                </div>
              </div>

              {/* Card 3: Storyboard & Scene Planner */}
              <div
                onClick={() => setActivePage('storyboard')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.22)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Step 3 • NEW
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Storyboard Planner
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Map scene-by-scene framing, camera movements, lighting moods, and continuity locks.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Plan Scenes &rarr;</span>
                </div>
              </div>

              {/* Card 4: Video Prompt Builder */}
              <div
                onClick={() => setActivePage('video-prompts')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Step 4
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Video Prompt Builder
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate Google Flow & Veo prompts with camera direction for every segment.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                  <span>Build Prompts &rarr;</span>
                </div>
              </div>

              {/* Card 5: Thumbnail Studio */}
              <div
                onClick={() => setActivePage('thumbnail-studio')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Step 5
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Thumbnail Studio
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Design high-CTR 16:9 thumbnail concepts with bold text overlays and prompt styling.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Create Thumbnails &rarr;</span>
                </div>
              </div>

              {/* Card 6: SEO Studio */}
              <div
                onClick={() => setActivePage('seo-studio')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Step 6
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    SEO Studio
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Strict &lt;= 500-char tags, viral YouTube titles, SEO descriptions, and keyword strategy.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Optimize Metadata &rarr;</span>
                </div>
              </div>

              {/* Card 7: YT Editor */}
              <div
                onClick={() => setActivePage('yt-editor')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      Step 7
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    YT Editor Timeline
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Assemble clips in a multi-track timeline with preview monitor, audio layers, and real export.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Timeline &rarr;</span>
                </div>
              </div>

              {/* Card 8: Voice & Audio Studio */}
              <div
                onClick={() => setActivePage('voice-audio')}
                className="group p-5 rounded-2xl border transition-all hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.22)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Step 8 • NEW
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Voice & Audio Studio
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Audition spoken narration with speech synthesis, voice rate calibration, and background tracks.
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Audition Audio &rarr;</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Creator Tools & Integrations (Trend Radar, Calendar, Drive) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trend Radar Preview */}
            <div
              className="p-5 rounded-2xl border flex flex-col justify-between jarvis-panel"
              style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Creator Trend Radar</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover trending topics across tech, space, explainers, and finance with verified hook angles.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setActivePage('trend-radar')}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  Scan Trending Niches &rarr;
                </button>
              </div>
            </div>

            {/* Content Calendar */}
            <div
              className="p-5 rounded-2xl border flex flex-col justify-between jarvis-panel"
              style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Content Calendar</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage video production deadlines, release schedules, and pre-publication verification.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setActivePage('calendar')}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  Open Schedule &rarr;
                </button>
              </div>
            </div>

            {/* Google Drive Storyboard Sync */}
            <div
              className="p-5 rounded-2xl border flex flex-col justify-between jarvis-panel"
              style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span>Google Drive Storyboard Sync</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Save your generated video storyboard documents and scripts directly to Google Drive.
                </p>
              </div>
              <div className="pt-2">
                <DriveStatusCard onDriveStatusChange={setDriveConnected} />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. SOURCES PAGE */}
      {activePage === 'sources' && (
        <SourcesTab
          userId={effectiveUserId}
          onSelectForScript={handleSelectSourceForScript}
        />
      )}

      {/* 3. SCRIPT GENERATOR PAGE */}
      {activePage === 'scripts' && (
        <ScriptGeneratorTab
          userId={effectiveUserId}
          initialSourceId={selectedScriptSourceId}
          onNavigateToSources={() => setActivePage('sources')}
          onNavigateToConfig={() => setActivePage('api-keys')}
          onTransferToVideoPrompts={handleTransferToVideoPrompts}
          onTransferToSEOStudio={handleTransferToSEOStudio}
          onTransferToThumbnailStudio={(script, title, article) =>
            handleTransferToThumbnailStudio({ script, sourceTitle: title, sourceArticle: article })
          }
          onTransferToYTEditor={(script, title) =>
            handleTransferToYTEditor(script, title)
          }
        />
      )}

      {/* 4. STORYBOARD PLANNER PAGE (NEW) */}
      {activePage === 'storyboard' && (
        <StoryboardTab
          userId={effectiveUserId}
          transferredScript={transferredScript}
          scriptTitle={activeProjectTitle}
          onNavigateToScript={() => setActivePage('scripts')}
          onTransferToVideoPrompts={handleTransferToVideoPrompts}
          onTransferToYTEditor={handleTransferToYTEditor}
        />
      )}

      {/* 5. VIDEO PROMPT BUILDER PAGE */}
      {activePage === 'video-prompts' && (
        <VideoPromptBuilderTab
          userId={effectiveUserId}
          transferredScript={transferredScript}
          transferredSourceTitle={transferredSourceTitle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
          onNavigateToOverview={() => setActivePage('overview')}
        />
      )}

      {/* 6. THUMBNAIL STUDIO PAGE */}
      {activePage === 'thumbnail-studio' && (
        <ThumbnailStudioTab
          userId={effectiveUserId}
          transferredScript={transferredThumbScript}
          transferredSourceTitle={transferredThumbSourceTitle}
          transferredSourceArticle={transferredThumbSourceArticle}
          transferredConcept={transferredThumbConcept}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
        />
      )}

      {/* 7. SEO STUDIO PAGE */}
      {activePage === 'seo-studio' && (
        <SEOStudioTab
          userId={effectiveUserId}
          transferredScript={transferredSEOScript}
          transferredSourceTitle={transferredSEOSourceTitle}
          transferredSourceArticle={transferredSEOSourceArticle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
          onTransferToThumbnailStudio={(params) =>
            handleTransferToThumbnailStudio(params)
          }
        />
      )}

      {/* 8. YT EDITOR PAGE */}
      {activePage === 'yt-editor' && (
        <YTEditorTab
          userId={effectiveUserId}
          transferredScript={transferredEditorScript}
          transferredSourceTitle={transferredEditorSourceTitle}
          onNavigateToScripts={() => setActivePage('scripts')}
          onNavigateToSources={() => setActivePage('sources')}
        />
      )}

      {/* 9. VOICE & AUDIO STUDIO PAGE (NEW) */}
      {activePage === 'voice-audio' && (
        <VoiceAudioStudioTab
          userId={effectiveUserId}
          transferredScript={transferredScript}
          scriptTitle={activeProjectTitle}
          onNavigateToScripts={() => setActivePage('scripts')}
        />
      )}

      {/* 10. TREND RADAR PAGE (NEW) */}
      {activePage === 'trend-radar' && (
        <TrendRadarTab
          userId={effectiveUserId}
          onSelectTrendForScript={handleSelectTrendForScript}
        />
      )}

      {/* 11. CONTENT CALENDAR PAGE (NEW) */}
      {activePage === 'calendar' && (
        <ContentCalendarTab
          userId={effectiveUserId}
          onNavigateToScript={() => setActivePage('scripts')}
        />
      )}

      {/* 12. PROJECT LIBRARY PAGE (NEW) */}
      {activePage === 'projects' && (
        <ProjectLibraryTab
          userId={effectiveUserId}
          onSelectProject={handleSelectProject}
          onNavigateToScript={() => setActivePage('scripts')}
          onNavigateToEditor={() => setActivePage('yt-editor')}
        />
      )}

      {/* 13. API CONFIGURATION PAGE */}
      {activePage === 'api-keys' && (
        <div className="space-y-6">
          <GeminiConfigCard userId={effectiveUserId} />
        </div>
      )}

      {/* 14. SETTINGS PAGE */}
      {activePage === 'settings' && (
        <SettingsPage />
      )}
    </AppLayout>
  );
};

export default DashboardPage;
