import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clapperboard,
  Scissors,
  Layers,
} from 'lucide-react';
import { type ScriptGenerationResponse } from '../services/api.ts';

export interface CreatorProject {
  id: string;
  title: string;
  status: 'Draft' | 'Scripted' | 'Storyboarded' | 'Produced' | 'Published';
  contentMode: string;
  durationSeconds: number;
  language: string;
  sourceText?: string;
  script?: ScriptGenerationResponse | null;
  createdAt: number;
  updatedAt: number;
}

interface ProjectLibraryTabProps {
  userId: string;
  activeProjectId?: string;
  onSelectProject?: (project: CreatorProject) => void;
  onNavigateToScript?: () => void;
  onNavigateToEditor?: () => void;
}

export const ProjectLibraryTab: React.FC<ProjectLibraryTabProps> = ({
  userId,
  activeProjectId,
  onSelectProject,
  onNavigateToScript,
  onNavigateToEditor,
}) => {
  const [projects, setProjects] = useState<CreatorProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMode, setNewMode] = useState('Science & Technology');
  const [newDuration, setNewDuration] = useState(32);
  const [newLanguage, setNewLanguage] = useState('English');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load projects from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`jarvis_projects_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          return;
        }
      }
    } catch {}

    // Default starter projects
    const defaults: CreatorProject[] = [
      {
        id: 'proj_default_1',
        title: 'Quantum Computing Microchips 2nm Physics',
        status: 'Scripted',
        contentMode: 'Science & Technology',
        durationSeconds: 32,
        language: 'English',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000,
      },
      {
        id: 'proj_default_2',
        title: 'Why Planes Never Fly Straight Across the Pacific',
        status: 'Storyboarded',
        contentMode: 'Explainer',
        durationSeconds: 40,
        language: 'English',
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 14400000,
      },
      {
        id: 'proj_default_3',
        title: 'The 1977 Wow! Radio Signal Mystery',
        status: 'Draft',
        contentMode: 'Mystery & Investigation',
        durationSeconds: 48,
        language: 'English',
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 86400000,
      },
    ];
    setProjects(defaults);
  }, [userId]);

  const saveProjects = (list: CreatorProject[]) => {
    setProjects(list);
    try {
      localStorage.setItem(`jarvis_projects_${userId}`, JSON.stringify(list));
    } catch {}
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject: CreatorProject = {
      id: `proj_${Date.now()}`,
      title: newTitle.trim(),
      status: 'Draft',
      contentMode: newMode,
      durationSeconds: newDuration,
      language: newLanguage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveProjects([newProject, ...projects]);
    setNewTitle('');
    setShowCreateModal(false);
    if (onSelectProject) onSelectProject(newProject);
  };

  const handleDelete = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  const handleDuplicate = (p: CreatorProject) => {
    const dupe: CreatorProject = {
      ...p,
      id: `proj_${Date.now()}`,
      title: `${p.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveProjects([dupe, ...projects]);
  };

  const handleExportJSON = (p: CreatorProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(p, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `${p.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_project.json`);
    dl.click();
  };

  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.contentMode.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>Project Library</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                  DATABASE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Centralized production archives, saved script drafts, storyboards, and project bundles
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl font-bold text-xs text-black flex items-center space-x-1.5 shadow-lg hover:opacity-90 transition-all cursor-pointer"
            style={{ backgroundColor: '#00f0ff' }}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter projects by title, mode, or status..."
          className="w-full sm:w-80 px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
        />
        <span className="text-xs font-mono text-cyan-400">
          {projects.length} Total Projects
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => {
          const isActive = proj.id === activeProjectId;
          return (
            <div
              key={proj.id}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all hover:border-cyan-400/40 jarvis-panel ${
                isActive ? 'jarvis-border-glow' : ''
              }`}
              style={{
                borderColor: isActive ? '#00f0ff' : 'rgba(0, 240, 255, 0.16)',
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {proj.contentMode}
                  </span>
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded border"
                    style={{
                      borderColor:
                        proj.status === 'Published'
                          ? 'rgba(16, 185, 129, 0.4)'
                          : 'rgba(56, 189, 248, 0.4)',
                      color: proj.status === 'Published' ? '#34d399' : '#38bdf8',
                    }}
                  >
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {proj.title}
                </h3>

                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{proj.durationSeconds}s duration</span>
                  <span>{proj.language}</span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  Updated: {new Date(proj.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleExportJSON(proj)}
                    className="p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors"
                    title="Export JSON"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(proj)}
                    className="p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors"
                    title="Duplicate Project"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg border text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Project"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject?.(proj)}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs text-black flex items-center space-x-1 transition-all hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#00f0ff' }}
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl border p-6 space-y-4 z-10 jarvis-panel jarvis-border-glow"
            style={{
              backgroundColor: 'rgba(9, 15, 29, 0.98)',
              borderColor: 'rgba(0, 240, 255, 0.4)',
            }}
          >
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span>Initialize New Project Workspace</span>
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Nuclear Fusion Reactor..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">
                  Content Mode
                </label>
                <select
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Educational">Educational</option>
                  <option value="Explainer">Explainer</option>
                  <option value="History">History</option>
                  <option value="Professional News">Professional News</option>
                  <option value="Business & Finance">Business & Finance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-200">
                    Duration
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <option value={24}>24s</option>
                    <option value={32}>32s</option>
                    <option value={40}>40s</option>
                    <option value={48}>48s</option>
                    <option value={56}>56s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-200">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Hinglish">Hinglish</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs text-slate-300 hover:text-white"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-bold text-xs text-black"
                  style={{ backgroundColor: '#00f0ff' }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectLibraryTab;
