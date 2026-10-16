import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  Bot,
  Layers,
  Clapperboard,
  Film,
  Search,
  Image as ImageIcon,
  Scissors,
  Lightbulb,
  CheckCircle2,
  Send,
  Zap,
} from 'lucide-react';
import { type NavigationPageId } from '../../navigation.ts';
import { type ScriptGenerationResponse } from '../../services/api.ts';

interface JarvisAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: NavigationPageId;
  currentScript?: ScriptGenerationResponse | null;
  scriptSourceTitle?: string;
  onNavigate: (pageId: NavigationPageId) => void;
}

export const JarvisAssistantPanel: React.FC<JarvisAssistantPanelProps> = ({
  isOpen,
  onClose,
  activePage,
  currentScript,
  scriptSourceTitle,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'jarvis' | 'user'; text: string; time: string }>>([
    {
      sender: 'jarvis',
      text: 'Good day creator. I am your JARVIS production copilot. I monitor your active pipeline and provide tactical script, scene, and SEO guidance.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  // Context-aware intelligent recommendations based on active page
  const getContextAdvice = () => {
    switch (activePage) {
      case 'overview':
        return {
          title: 'Command Center Status',
          nextStep: 'Research or Script Generation',
          actionPage: 'scripts' as NavigationPageId,
          actionLabel: 'Launch Script Generator',
          tips: [
            'Pick a focused topic in Script Generator or pull research from Sources.',
            'Target 32s or 48s for maximum short-form completion rate.',
          ],
        };
      case 'sources':
        return {
          title: 'Research & Verification',
          nextStep: 'Script Formulation',
          actionPage: 'scripts' as NavigationPageId,
          actionLabel: 'Turn Source into Script',
          tips: [
            'Filter out duplicate or disputed claims before generating.',
            'Saved sources are synced to your persistent library.',
          ],
        };
      case 'scripts':
        return {
          title: 'Script Composition',
          nextStep: 'Storyboard Planning',
          actionPage: 'storyboard' as NavigationPageId,
          actionLabel: 'Create Storyboard',
          tips: [
            'Keep spoken narration between 2.0 and 2.3 words/sec.',
            'Segment 1 must hook within 2 seconds without pleasantries.',
          ],
        };
      case 'storyboard':
        return {
          title: 'Visual Scene Planning',
          nextStep: 'Video Prompt Builder',
          actionPage: 'video-prompts' as NavigationPageId,
          actionLabel: 'Generate Flow Prompts',
          tips: [
            'Alternate camera motion (push-in, orbit, drone) to maintain retention.',
            'Specify lighting mood for consistent look across scenes.',
          ],
        };
      case 'video-prompts':
        return {
          title: 'Visual Prompt Engineering',
          nextStep: 'Thumbnail Design',
          actionPage: 'thumbnail-studio' as NavigationPageId,
          actionLabel: 'Open Thumbnail Studio',
          tips: [
            'Copy All Prompts formats complete instructions for Google Flow.',
            'Lock 9:16 aspect ratio for Shorts & Reels.',
          ],
        };
      case 'thumbnail-studio':
        return {
          title: 'CTR Optimization',
          nextStep: 'YouTube SEO Studio',
          actionPage: 'seo-studio' as NavigationPageId,
          actionLabel: 'Optimize Video SEO',
          tips: [
            'High-contrast focal point with <= 4 words of bold text.',
            'Emotions and high-stakes curiosity drive initial clicks.',
          ],
        };
      case 'seo-studio':
        return {
          title: 'Search & Discovery',
          nextStep: 'YT Editor Timeline',
          actionPage: 'yt-editor' as NavigationPageId,
          actionLabel: 'Open Video Editor',
          tips: [
            'Keep tags strictly under 500 characters to comply with YouTube limits.',
            'Put the primary search keyword in the first 60 characters of the title.',
          ],
        };
      case 'yt-editor':
        return {
          title: 'Multi-track Video Timeline',
          nextStep: 'Export & Publishing',
          actionPage: 'calendar' as NavigationPageId,
          actionLabel: 'View Content Calendar',
          tips: [
            'Sync visual cuts to script voiceover pause beats.',
            'Use real export button to render playable webm/mp4 sequence.',
          ],
        };
      default:
        return {
          title: 'JARVIS Studio Copilot',
          nextStep: 'Overview',
          actionPage: 'overview' as NavigationPageId,
          actionLabel: 'Return to Command',
          tips: ['Configure Gemini API keys in Settings for highest throughput.'],
        };
    }
  };

  const advice = getContextAdvice();

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = `Understood. For ${activePage.replace('-', ' ')}, I recommend proceeding to ${advice.nextStep}.`;
      const lower = userMsg.toLowerCase();
      if (lower.includes('hook') || lower.includes('retention')) {
        reply = 'For maximum retention, formulate the hook as an unresolved contradiction: state a known fact, then reveal an astonishing discrepancy. Avoid "hello guys" or "today we discuss".';
      } else if (lower.includes('tag') || lower.includes('seo')) {
        reply = 'YouTube limits tags to 500 characters. Our SEO Studio enforces this strictly. Focus on 1 primary broad keyword, 3 specific phrases, and 2 niche tags.';
      } else if (lower.includes('prompt') || lower.includes('veo') || lower.includes('flow')) {
        reply = 'When prompting Google Flow or Veo, specify camera lens (35mm / anamorphic), volumetric lighting, and exact motion direction (e.g., slow clockwise crane push).';
      } else if (lower.includes('editor') || lower.includes('export')) {
        reply = 'YT Editor supports real client-side canvas rendering. Arrange your audio and video clips on separate tracks and click Export in the top bar.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'jarvis', text: reply, time: 'Just now' },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 sm:w-96 border-l shadow-2xl flex flex-col backdrop-blur-2xl transition-all"
      style={{
        backgroundColor: 'rgba(5, 8, 17, 0.95)',
        borderColor: 'rgba(0, 240, 255, 0.25)',
      }}
    >
      {/* Top Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(0, 240, 255, 0.15)' }}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className="p-2 rounded-xl border text-cyan-300"
            style={{
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              borderColor: 'rgba(0, 240, 255, 0.3)',
            }}
          >
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>JARVIS AI COPILOT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </h3>
            <p className="text-[10px] text-cyan-400 font-mono">
              Active Module: {activePage}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors cursor-pointer"
          style={{ borderColor: 'rgba(0, 240, 255, 0.15)' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Tactical Guidance + Live Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context Card */}
        <div
          className="p-3.5 rounded-xl border space-y-2.5"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.85)',
            borderColor: 'rgba(0, 240, 255, 0.2)',
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next Strategic Step</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase">
              Pipeline Rec
            </span>
          </div>
          <div className="text-xs text-slate-300">
            {advice.title}: {advice.nextStep}
          </div>

          <button
            onClick={() => onNavigate(advice.actionPage)}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs text-black shadow-md flex items-center justify-center space-x-1.5 transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#00f0ff' }}
          >
            <span>{advice.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Project / Script Info */}
        {currentScript && (
          <div
            className="p-3 rounded-xl border text-xs space-y-1.5"
            style={{
              backgroundColor: 'rgba(9, 15, 29, 0.6)',
              borderColor: 'rgba(0, 240, 255, 0.12)',
            }}
          >
            <div className="font-semibold text-white flex items-center justify-between">
              <span className="truncate">{scriptSourceTitle || 'Active Project Script'}</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {currentScript.segments?.length || 0} Segs
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Mode: {currentScript.contentMode} • {currentScript.durationSeconds}s • {currentScript.language}
            </div>
          </div>
        )}

        {/* Tactical Best Practices */}
        <div
          className="p-3.5 rounded-xl border space-y-2 text-xs"
          style={{
            backgroundColor: 'rgba(9, 15, 29, 0.6)',
            borderColor: 'rgba(0, 240, 255, 0.12)',
          }}
        >
          <div className="font-bold text-white flex items-center space-x-1.5 text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Tactical Intelligence</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            {advice.tips.map((tip, i) => (
              <li key={i} className="flex items-start space-x-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dialogue Stream */}
        <div className="space-y-2.5 pt-2">
          <div className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
            Copilot Communications
          </div>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl text-xs space-y-1 ${
                m.sender === 'user' ? 'ml-6 border text-white' : 'mr-4 border text-cyan-100'
              }`}
              style={{
                backgroundColor: m.sender === 'user' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(9, 15, 29, 0.85)',
                borderColor: m.sender === 'user' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.15)',
              }}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70">
                <span className="font-bold uppercase tracking-wider">
                  {m.sender === 'jarvis' ? 'JARVIS AI' : 'Creator'}
                </span>
                <span>{m.time}</span>
              </div>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t flex items-center space-x-2"
        style={{ borderColor: 'rgba(0, 240, 255, 0.15)' }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask JARVIS about script, scenes, SEO..."
          className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl text-black font-bold disabled:opacity-40 transition-all cursor-pointer"
          style={{ backgroundColor: '#00f0ff' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
