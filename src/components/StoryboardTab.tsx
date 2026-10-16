import React, { useState, useEffect } from 'react';
import {
  Layers,
  Film,
  Camera,
  Sun,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Scissors,
  Clapperboard,
  Sliders,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { type ScriptGenerationResponse, type GeneratedSegment } from '../services/api.ts';

export interface StoryboardScene {
  id: string;
  segmentNumber: number;
  segmentType: string;
  timestamp: string;
  durationSeconds: number;
  dialogue: string;
  visualDescription: string;
  shotType: string;
  cameraMovement: string;
  lightingMood: string;
  requiredAssets: string;
  transition: string;
  continuityLock: string;
  status: 'Planned' | 'Visualized' | 'Rendered';
}

interface StoryboardTabProps {
  userId: string;
  transferredScript?: ScriptGenerationResponse | null;
  scriptTitle?: string;
  onNavigateToScript?: () => void;
  onTransferToVideoPrompts?: (script: ScriptGenerationResponse, sourceTitle?: string) => void;
  onTransferToYTEditor?: (script: ScriptGenerationResponse, sourceTitle?: string) => void;
}

const SHOT_TYPES = [
  'Extreme Wide Shot (Establishing)',
  'Wide Action Shot (Full Body)',
  'Medium Close-Up (Chest Up)',
  'Tight Macro Close-Up (Details)',
  'Low-Angle Hero Shot',
  'High-Angle Aerial Drone Shot',
  'Dutch Angle (Dramatic Tension)',
  'Over-the-Shoulder Focus',
];

const CAMERA_MOVEMENTS = [
  'Slow Cinematic Push-In',
  'Dynamic 360 Orbit',
  'Rapid Whip Pan',
  'Vertical Crane Tilt',
  'Smooth Tracking Dolly',
  'Handheld Shaky-Cam',
  'Static Locked Tripod',
  'Forward Drone Fly-Through',
];

const LIGHTING_MOODS = [
  'High-Contrast Cyberpunk Neon (Cyan & Amber)',
  'Golden Hour Warm Ambient Rays',
  'Moody Chiaroscuro Volumetric Smoke',
  'Crisp High-Key Studio Cleanroom',
  'Deep Space Rim Lighting',
  'Documentary Natural Daylight',
  'Dramatic Red Alert Warning Glow',
];

const TRANSITIONS = [
  'Hard Action Cut',
  'Fast Whip Pan Blur',
  'Match Dissolve',
  'Glitch Digital Artifact',
  'Zoom-In Warp Transition',
  'Flash to White',
  'Crossfade',
];

export const StoryboardTab: React.FC<StoryboardTabProps> = ({
  userId,
  transferredScript,
  scriptTitle = 'Active Project Storyboard',
  onNavigateToScript,
  onTransferToVideoPrompts,
  onTransferToYTEditor,
}) => {
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Derive initial scenes from transferred script segments
  useEffect(() => {
    if (transferredScript && transferredScript.segments?.length > 0) {
      const derived: StoryboardScene[] = transferredScript.segments.map((seg, idx) => {
        const isHook = seg.type.toUpperCase().includes('HOOK');
        const isEnding = seg.type.toUpperCase().includes('ENDING');

        return {
          id: `scene_${seg.segmentNumber}_${Date.now()}_${idx}`,
          segmentNumber: seg.segmentNumber,
          segmentType: seg.type,
          timestamp: seg.timestamp,
          durationSeconds: seg.estimatedDurationSeconds || 8,
          dialogue: seg.voiceover,
          visualDescription: isHook
            ? `Dramatic high-impact opening visually demonstrating ${transferredScript.topic || 'the central premise'}. High visual curiosity and immediate kinetic motion.`
            : isEnding
            ? `Conclusive visual payoff summarizing the key takeaway, leading viewer to subscribe.`
            : `Information-dense visual breakdown illustrating: ${seg.voiceover.slice(0, 80)}...`,
          shotType: isHook ? SHOT_TYPES[4] : isEnding ? SHOT_TYPES[2] : SHOT_TYPES[idx % SHOT_TYPES.length],
          cameraMovement: isHook ? CAMERA_MOVEMENTS[0] : CAMERA_MOVEMENTS[(idx + 1) % CAMERA_MOVEMENTS.length],
          lightingMood: LIGHTING_MOODS[idx % LIGHTING_MOODS.length],
          requiredAssets: '4K B-roll, 3D graphics overlay, subtle sound effect hit',
          transition: TRANSITIONS[idx % TRANSITIONS.length],
          continuityLock: `Maintain consistent subject color grading and lens focal length`,
          status: 'Planned',
        };
      });
      setScenes(derived);
      setSelectedSceneId(derived[0]?.id || null);
    } else {
      // Default demo scenes if no script is loaded yet
      const sampleScenes: StoryboardScene[] = [
        {
          id: 'scene_sample_1',
          segmentNumber: 1,
          segmentType: 'HOOK',
          timestamp: '00–08s',
          durationSeconds: 8,
          dialogue: 'Inside this cleanroom, engineers are testing a microchip that bends the laws of physics.',
          visualDescription: 'Extreme macro close-up of a glowing semiconductor die inside a sterile cleanroom chamber with robotic probe arms.',
          shotType: SHOT_TYPES[3],
          cameraMovement: CAMERA_MOVEMENTS[0],
          lightingMood: LIGHTING_MOODS[3],
          requiredAssets: 'Wafer die macro footage, robotic arm laser overlay',
          transition: TRANSITIONS[1],
          continuityLock: 'Cyan laser reflections on silicon surface',
          status: 'Planned',
        },
        {
          id: 'scene_sample_2',
          segmentNumber: 2,
          segmentType: 'MAIN PART 1',
          timestamp: '08–16s',
          durationSeconds: 8,
          dialogue: 'Traditional silicon transistors reached quantum limits, leaking current at microscopic scales.',
          visualDescription: '3D animated cutaway of silicon lattice showing subatomic electron leakage with warning heat-map pulse.',
          shotType: SHOT_TYPES[1],
          cameraMovement: CAMERA_MOVEMENTS[1],
          lightingMood: LIGHTING_MOODS[0],
          requiredAssets: 'Atomic lattice wireframe, electrical arc SFX',
          transition: TRANSITIONS[0],
          continuityLock: 'Maintain orange thermal glow for leakage representation',
          status: 'Planned',
        },
        {
          id: 'scene_sample_3',
          segmentNumber: 3,
          segmentType: 'MAIN PART 2',
          timestamp: '16–24s',
          durationSeconds: 8,
          dialogue: 'By swapping silicon for 2D graphene sheets, operational speeds jumped tenfold.',
          visualDescription: 'Futuristic laboratory bench with scientists observing hexagonal carbon lattice glowing under electron microscope.',
          shotType: SHOT_TYPES[2],
          cameraMovement: CAMERA_MOVEMENTS[4],
          lightingMood: LIGHTING_MOODS[4],
          requiredAssets: 'Graphene sheet render, scientist HUD goggles',
          transition: TRANSITIONS[4],
          continuityLock: 'Hexagonal motif consistent across displays',
          status: 'Planned',
        },
        {
          id: 'scene_sample_4',
          segmentNumber: 4,
          segmentType: 'ENDING',
          timestamp: '24–32s',
          durationSeconds: 8,
          dialogue: 'The silicon era is ending—and the computing revolution is just beginning.',
          visualDescription: 'Wide epic pull-back revealing endless datacenter server racks humming with cyan optical cables.',
          shotType: SHOT_TYPES[0],
          cameraMovement: CAMERA_MOVEMENTS[7],
          lightingMood: LIGHTING_MOODS[0],
          requiredAssets: 'Endless server corridor, optical lens flares',
          transition: TRANSITIONS[5],
          continuityLock: 'Final logo lockup on central server rack',
          status: 'Planned',
        },
      ];
      setScenes(sampleScenes);
      setSelectedSceneId(sampleScenes[0].id);
    }
  }, [transferredScript]);

  // Total planned duration
  const totalDuration = scenes.reduce((sum, s) => sum + (s.durationSeconds || 8), 0);

  // Update a specific scene property
  const handleUpdateScene = (id: string, field: keyof StoryboardScene, value: any) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Add new scene
  const handleAddScene = () => {
    const nextNum = scenes.length + 1;
    const startSec = (nextNum - 1) * 8;
    const endSec = nextNum * 8;
    const newScene: StoryboardScene = {
      id: `scene_custom_${Date.now()}`,
      segmentNumber: nextNum,
      segmentType: `SCENE ${nextNum}`,
      timestamp: `${String(startSec).padStart(2, '0')}–${String(endSec).padStart(2, '0')}s`,
      durationSeconds: 8,
      dialogue: 'Enter dialogue or narration voiceover here...',
      visualDescription: 'Describe shot visuals, camera focal points, and action...',
      shotType: SHOT_TYPES[0],
      cameraMovement: CAMERA_MOVEMENTS[0],
      lightingMood: LIGHTING_MOODS[0],
      requiredAssets: 'B-roll footage, sound effect',
      transition: TRANSITIONS[0],
      continuityLock: 'Consistent color grading and lighting',
      status: 'Planned',
    };
    setScenes([...scenes, newScene]);
    setSelectedSceneId(newScene.id);
  };

  // Delete scene
  const handleDeleteScene = (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
    if (selectedSceneId === id) {
      setSelectedSceneId(scenes.find((s) => s.id !== id)?.id || null);
    }
  };

  // Copy full storyboard to clipboard
  const handleCopyAll = async () => {
    const md = scenes
      .map(
        (s) =>
          `### Scene ${s.segmentNumber}: ${s.segmentType} (${s.timestamp})\n` +
          `**Dialogue:** "${s.dialogue}"\n` +
          `**Visual:** ${s.visualDescription}\n` +
          `**Camera:** ${s.shotType} • ${s.cameraMovement}\n` +
          `**Lighting:** ${s.lightingMood}\n` +
          `**Transition:** ${s.transition} | **Continuity:** ${s.continuityLock}\n`
      )
      .join('\n---\n\n');

    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  // Download storyboard markdown
  const handleDownload = () => {
    const md =
      `# Storyboard & Scene Plan: ${scriptTitle}\n` +
      `**Total Scenes:** ${scenes.length} | **Estimated Duration:** ${totalDuration}s\n` +
      `**Generated with JARVIS Creator Studio**\n\n---\n\n` +
      scenes
        .map(
          (s) =>
            `## Scene ${s.segmentNumber}: ${s.segmentType} [${s.timestamp}]\n\n` +
            `- **Narration:** "${s.dialogue}"\n` +
            `- **Visual Direction:** ${s.visualDescription}\n` +
            `- **Framing:** ${s.shotType}\n` +
            `- **Camera Movement:** ${s.cameraMovement}\n` +
            `- **Lighting & Mood:** ${s.lightingMood}\n` +
            `- **Required Assets:** ${s.requiredAssets}\n` +
            `- **Transition Out:** ${s.transition}\n` +
            `- **Continuity Lock:** ${s.continuityLock}\n` +
            `- **Status:** ${s.status}\n`
        )
        .join('\n---\n\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_storyboard.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Transfer scenes as script to Video Prompts
  const handleProceedToPrompts = () => {
    if (!onTransferToVideoPrompts) return;
    const segments: GeneratedSegment[] = scenes.map((s) => ({
      segmentNumber: s.segmentNumber,
      type: s.segmentType,
      timestamp: s.timestamp,
      voiceover: s.dialogue,
      estimatedDurationSeconds: s.durationSeconds,
      wordCount: s.dialogue.split(/\s+/).filter(Boolean).length,
    }));

    const mockScript: ScriptGenerationResponse = {
      contentMode: 'Documentary',
      durationSeconds: totalDuration,
      language: 'English',
      totalSegments: scenes.length,
      estimatedTotalSeconds: totalDuration,
      segments,
      model: 'gemini-3.8-flash',
    };

    onTransferToVideoPrompts(mockScript, scriptTitle);
  };

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const filteredScenes = scenes.filter((s) => {
    if (filterStatus === 'All') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="p-6 rounded-2xl border shadow-lg relative overflow-hidden jarvis-panel"
        style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div
                className="p-2.5 rounded-xl border text-cyan-300 shadow-sm"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                }}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Storyboard & Scene Planner</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                    JARVIS HUD
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Shot-by-shot visual mapping, camera motion, and cinematic mood linked directly to script narration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all hover:bg-slate-800/40 text-slate-200 cursor-pointer"
              style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all hover:bg-slate-800/40 text-slate-200 cursor-pointer"
              style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download (.md)</span>
            </button>

            <button
              onClick={handleAddScene}
              className="px-3 py-1.5 rounded-xl font-bold text-xs text-black flex items-center space-x-1.5 shadow-md hover:opacity-90 transition-all cursor-pointer"
              style={{ backgroundColor: '#00f0ff' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scene</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Scenes Timeline Strip + Right Scene Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scene Cards Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Shot Sequence ({scenes.length} Scenes • ~{totalDuration}s)</span>
            </div>

            <div className="flex items-center space-x-1 text-xs">
              {['All', 'Planned', 'Visualized', 'Rendered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                    filterStatus === status ? 'text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: filterStatus === status ? '#00f0ff' : 'transparent',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredScenes.map((scene, idx) => {
              const isSelected = scene.id === selectedScene?.id;
              const isHook = scene.segmentType.toUpperCase().includes('HOOK');
              const isEnding = scene.segmentType.toUpperCase().includes('ENDING');

              return (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected ? 'jarvis-border-glow bg-cyan-950/20' : 'hover:border-cyan-500/30'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.06)' : 'rgba(9, 15, 29, 0.85)',
                    borderColor: isSelected ? '#00f0ff' : 'rgba(0, 240, 255, 0.16)',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isHook
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isEnding
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {scene.segmentType}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {scene.timestamp} ({scene.durationSeconds}s)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded border"
                        style={{
                          borderColor:
                            scene.status === 'Rendered'
                              ? 'rgba(16, 185, 129, 0.4)'
                              : scene.status === 'Visualized'
                              ? 'rgba(56, 189, 248, 0.4)'
                              : 'rgba(245, 158, 11, 0.3)',
                          color:
                            scene.status === 'Rendered'
                              ? '#34d399'
                              : scene.status === 'Visualized'
                              ? '#38bdf8'
                              : '#fbbf24',
                        }}
                      >
                        {scene.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScene(scene.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete scene"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dialogue line */}
                  <div className="text-xs text-white font-medium italic border-l-2 pl-2.5 border-cyan-500/40">
                    &ldquo;{scene.dialogue}&rdquo;
                  </div>

                  {/* Visual direction */}
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {scene.visualDescription}
                  </div>

                  {/* Camera & Lighting Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-cyan-300">
                    <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-cyan-500/20">
                      📷 {scene.shotType.split('(')[0].trim()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-cyan-500/20">
                      🎬 {scene.cameraMovement}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/60 border border-cyan-500/20">
                      💡 {scene.lightingMood.split('(')[0].trim()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Scene Detail Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Scene Direction Inspector</span>
          </div>

          {selectedScene ? (
            <div
              className="p-5 rounded-2xl border space-y-4 jarvis-panel"
              style={{ borderColor: 'rgba(0, 240, 255, 0.25)' }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <span className="text-xs font-bold text-cyan-300">
                  {selectedScene.segmentType} Configuration
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedScene.timestamp}
                </span>
              </div>

              {/* Spoken Dialogue */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Voiceover Narration
                </label>
                <textarea
                  value={selectedScene.dialogue}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'dialogue', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 resize-none"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                />
              </div>

              {/* Visual Scene Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Visual Description (For Video Prompts / AI Generators)
                </label>
                <textarea
                  value={selectedScene.visualDescription}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'visualDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 resize-none"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                />
              </div>

              {/* Framing / Shot Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Camera Shot Framing
                </label>
                <select
                  value={selectedScene.shotType}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'shotType', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  {SHOT_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Movement */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Camera Motion Direction
                </label>
                <select
                  value={selectedScene.cameraMovement}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'cameraMovement', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  {CAMERA_MOVEMENTS.map((cm) => (
                    <option key={cm} value={cm}>
                      {cm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lighting Mood */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Lighting & Atmospheric Mood
                </label>
                <select
                  value={selectedScene.lightingMood}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'lightingMood', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  {LIGHTING_MOODS.map((lm) => (
                    <option key={lm} value={lm}>
                      {lm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transition Out */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Scene Transition Out
                </label>
                <select
                  value={selectedScene.transition}
                  onChange={(e) => handleUpdateScene(selectedScene.id, 'transition', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  {TRANSITIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Production Status */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-200">
                  Production Stage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Planned', 'Visualized', 'Rendered'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateScene(selectedScene.id, 'status', st)}
                      className="py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      style={{
                        backgroundColor: selectedScene.status === st ? '#00f0ff' : 'rgba(9, 15, 29, 0.8)',
                        color: selectedScene.status === st ? '#000000' : '#94a3b8',
                        border: '1px solid',
                        borderColor: selectedScene.status === st ? '#00f0ff' : 'rgba(0, 240, 255, 0.2)',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border text-center text-xs text-slate-400 border-cyan-500/20">
              Select a scene from the left to inspect and edit camera parameters.
            </div>
          )}

          {/* Quick Transfer Card */}
          <div
            className="p-4 rounded-2xl border space-y-2 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
          >
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next Pipeline Operations</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {onTransferToVideoPrompts && (
                <button
                  onClick={handleProceedToPrompts}
                  className="p-2.5 rounded-xl border text-left hover:border-cyan-400 transition-all cursor-pointer space-y-0.5"
                  style={{
                    backgroundColor: 'rgba(9, 15, 29, 0.8)',
                    borderColor: 'rgba(0, 240, 255, 0.2)',
                  }}
                >
                  <Film className="w-4 h-4 text-purple-400" />
                  <div className="text-xs font-bold text-white">Flow Prompts</div>
                  <div className="text-[10px] text-slate-400">Send to Veo / Flow</div>
                </button>
              )}

              {onTransferToYTEditor && (
                <button
                  onClick={() => {
                    const mockScript: ScriptGenerationResponse = {
                      contentMode: 'Documentary',
                      durationSeconds: totalDuration,
                      language: 'English',
                      totalSegments: scenes.length,
                      estimatedTotalSeconds: totalDuration,
                      segments: scenes.map((s) => ({
                        segmentNumber: s.segmentNumber,
                        type: s.segmentType,
                        timestamp: s.timestamp,
                        voiceover: s.dialogue,
                        estimatedDurationSeconds: s.durationSeconds,
                        wordCount: s.dialogue.split(/\s+/).filter(Boolean).length,
                      })),
                      model: 'gemini-3.8-flash',
                    };
                    onTransferToYTEditor(mockScript, scriptTitle);
                  }}
                  className="p-2.5 rounded-xl border text-left hover:border-cyan-400 transition-all cursor-pointer space-y-0.5"
                  style={{
                    backgroundColor: 'rgba(9, 15, 29, 0.8)',
                    borderColor: 'rgba(0, 240, 255, 0.2)',
                  }}
                >
                  <Scissors className="w-4 h-4 text-pink-400" />
                  <div className="text-xs font-bold text-white">YT Editor</div>
                  <div className="text-[10px] text-slate-400">Load into Timeline</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoryboardTab;
