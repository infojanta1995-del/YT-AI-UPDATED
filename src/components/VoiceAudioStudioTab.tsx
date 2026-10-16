import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  Play,
  Pause,
  Square,
  Sliders,
  Sparkles,
  Music,
  Check,
  Copy,
  Radio,
  RefreshCw,
  Clapperboard,
} from 'lucide-react';
import { type ScriptGenerationResponse } from '../services/api.ts';

interface VoiceAudioStudioTabProps {
  userId: string;
  transferredScript?: ScriptGenerationResponse | null;
  scriptTitle?: string;
  onNavigateToScripts?: () => void;
}

export const VoiceAudioStudioTab: React.FC<VoiceAudioStudioTabProps> = ({
  userId,
  transferredScript,
  scriptTitle = 'Active Project Narration',
  onNavigateToScripts,
}) => {
  // Speech synthesis state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayingSegmentIdx, setCurrentPlayingSegmentIdx] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  // Background audio preset state
  const [bgMusicPreset, setBgMusicPreset] = useState<string>('Cyberpunk Ambience');
  const [bgVolume, setBgVolume] = useState<number>(15);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const segments = transferredScript?.segments || [
    {
      segmentNumber: 1,
      type: 'HOOK',
      timestamp: '00–08s',
      voiceover: 'Inside this cleanroom, engineers are testing a microchip that bends the laws of physics.',
      estimatedDurationSeconds: 8,
      wordCount: 15,
    },
    {
      segmentNumber: 2,
      type: 'MAIN PART 1',
      timestamp: '08–16s',
      voiceover: 'Traditional silicon transistors reached quantum limits, leaking current at microscopic scales.',
      estimatedDurationSeconds: 8,
      wordCount: 12,
    },
    {
      segmentNumber: 3,
      type: 'MAIN PART 2',
      timestamp: '16–24s',
      voiceover: 'By swapping silicon for 2D graphene sheets, operational speeds jumped tenfold.',
      estimatedDurationSeconds: 8,
      wordCount: 11,
    },
    {
      segmentNumber: 4,
      type: 'ENDING',
      timestamp: '24–32s',
      voiceover: 'The silicon era is ending—and the computing revolution is just beginning.',
      estimatedDurationSeconds: 8,
      wordCount: 11,
    },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        if (available.length > 0 && !selectedVoiceURI) {
          // Prefer English, Hindi, or default voice
          const preferred =
            available.find((v) => v.lang.includes('en') || v.lang.includes('hi')) || available[0];
          setSelectedVoiceURI(preferred.voiceURI);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handlePlaySegment = (index: number) => {
    if (!synthRef.current || !speechSupported) return;

    synthRef.current.cancel();
    const seg = segments[index];
    if (!seg) return;

    const utterance = new SpeechSynthesisUtterance(seg.voiceover);
    const chosen = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (chosen) utterance.voice = chosen;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentPlayingSegmentIdx(index);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentPlayingSegmentIdx(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentPlayingSegmentIdx(null);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handlePlayAll = () => {
    if (!synthRef.current || !speechSupported) return;

    synthRef.current.cancel();
    let currentIdx = 0;

    const playNext = () => {
      if (currentIdx >= segments.length) {
        setIsPlaying(false);
        setCurrentPlayingSegmentIdx(null);
        return;
      }

      const seg = segments[currentIdx];
      const utterance = new SpeechSynthesisUtterance(seg.voiceover);
      const chosen = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosen) utterance.voice = chosen;
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentPlayingSegmentIdx(currentIdx);
      };

      utterance.onend = () => {
        currentIdx++;
        playNext();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentPlayingSegmentIdx(null);
      };

      synthRef.current?.speak(utterance);
    };

    playNext();
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentPlayingSegmentIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="p-6 rounded-2xl border shadow-lg relative overflow-hidden jarvis-panel"
        style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-xl border text-cyan-300"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderColor: 'rgba(0, 240, 255, 0.3)',
              }}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>Voice & Audio Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                  SYNTH HUD
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Audition spoken voiceover narration, calibrate cadence (words per second), and preview pacing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlayAll}
                className="px-4 py-2 rounded-xl font-bold text-xs text-black flex items-center space-x-2 shadow-lg hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: '#00f0ff' }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Audition Full Script</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Playback</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!speechSupported && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs">
          Speech synthesis is not natively supported in this browser environment. Voice playback will run in text simulation mode.
        </div>
      )}

      {/* Grid: Voice Settings Left + Script Segments Playback Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice & Audio Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className="p-5 rounded-2xl border space-y-4 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.25)' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Voice Calibration</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {voices.length} System Voices
              </span>
            </div>

            {/* Voice Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Selected Voice Actor
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
              >
                {voices.length === 0 ? (
                  <option value="">Default System Voice</option>
                ) : (
                  voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Speaking Rate / Speed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Narration Speed (Rate)</span>
                <span className="font-mono text-cyan-400">{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.7x (Cinematic)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Fast Shorts)</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>Voice Pitch / Tone</span>
                <span className="font-mono text-cyan-400">{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Deep / Authoritative</span>
                <span>Natural</span>
                <span>Bright / Energetic</span>
              </div>
            </div>

            {/* Background Soundtrack Preset */}
            <div className="space-y-1.5 pt-2 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center space-x-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atmospheric Background Track</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">{bgVolume}% Vol</span>
              </div>
              <select
                value={bgMusicPreset}
                onChange={(e) => setBgMusicPreset(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
              >
                <option value="Cyberpunk Ambience">Cyberpunk Dark Synth (Low Drone)</option>
                <option value="Epic Documentary Strings">Epic Documentary Orchestral Strings</option>
                <option value="Lo-Fi Explainer Beats">Lo-Fi Explainer Chillhop Beats</option>
                <option value="High-Stakes Investigation">High-Stakes Investigative Ticking Sub-Bass</option>
                <option value="Modern Corporate Tech">Modern Corporate Minimal Tech Pulse</option>
              </select>

              <input
                type="range"
                min="0"
                max="50"
                value={bgVolume}
                onChange={(e) => setBgVolume(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer mt-1"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Script Segments List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Narration Segments ({segments.length})</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">
              {scriptTitle}
            </span>
          </div>

          <div className="space-y-3">
            {segments.map((seg, idx) => {
              const isCurrent = currentPlayingSegmentIdx === idx;
              const isHook = seg.type.toUpperCase().includes('HOOK');
              const isEnding = seg.type.toUpperCase().includes('ENDING');

              return (
                <div
                  key={seg.segmentNumber}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent ? 'jarvis-border-glow bg-cyan-950/30' : 'hover:border-cyan-500/30'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? 'rgba(0, 240, 255, 0.08)' : 'rgba(9, 15, 29, 0.85)',
                    borderColor: isCurrent ? '#00f0ff' : 'rgba(0, 240, 255, 0.16)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isHook
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isEnding
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {seg.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {seg.timestamp}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-cyan-400 animate-pulse flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>SPEAKING...</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlaySegment(idx)}
                      disabled={isPlaying && isCurrent}
                      className="px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 hover:bg-cyan-500/20 text-cyan-300 transition-colors cursor-pointer"
                      style={{ borderColor: 'rgba(0, 240, 255, 0.25)' }}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Audition</span>
                    </button>
                  </div>

                  <p className="text-xs text-white leading-relaxed font-medium">
                    &ldquo;{seg.voiceover}&rdquo;
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyan-500/10 text-[11px] text-slate-400 font-mono">
                    <span>{seg.wordCount} words</span>
                    <span>
                      Pacing: ~{(seg.wordCount / (seg.estimatedDurationSeconds || 8)).toFixed(1)} words/sec
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VoiceAudioStudioTab;
