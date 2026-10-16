import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  AlertCircle,
  Film,
  Sparkles,
  Filter,
} from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  targetDate: string;
  stage: 'Scripting' | 'Storyboarding' | 'Thumbnail' | 'Editing' | 'Ready to Publish' | 'Published';
  contentMode: string;
  notes: string;
}

interface ContentCalendarTabProps {
  userId: string;
  onNavigateToScript?: () => void;
}

export const ContentCalendarTab: React.FC<ContentCalendarTabProps> = ({
  userId,
  onNavigateToScript,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStage, setNewStage] = useState<CalendarEvent['stage']>('Scripting');
  const [newMode, setNewMode] = useState('Science & Technology');
  const [newNotes, setNewNotes] = useState('');
  const [filterStage, setFilterStage] = useState<string>('All');
  const [checklist, setChecklist] = useState({
    hookVerified: true,
    tagsUnder500: true,
    thumb16x9: true,
    audioBalanced: false,
    linksVerified: false,
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`jarvis_calendar_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          return;
        }
      }
    } catch {}

    // Initial default events if empty
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 2);
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 5);

    const initialEvents: CalendarEvent[] = [
      {
        id: 'cal_event_1',
        title: 'Quantum Computing Microchips 2nm Breakthrough',
        targetDate: d1.toISOString().split('T')[0],
        stage: 'Editing',
        contentMode: 'Science & Technology',
        notes: 'Waiting for 4K wafer B-roll sequence. Timeline cuts complete.',
      },
      {
        id: 'cal_event_2',
        title: 'Why Airplanes Never Fly Straight Across the Pacific',
        targetDate: d2.toISOString().split('T')[0],
        stage: 'Storyboarding',
        contentMode: 'Explainer',
        notes: 'Great circle spherical projection graphics verified.',
      },
    ];
    setEvents(initialEvents);
  }, [userId]);

  // Save to localStorage
  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem(`jarvis_calendar_${userId}`, JSON.stringify(updated));
    } catch {}
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const eventDate = newDate || new Date().toISOString().split('T')[0];
    const newEvent: CalendarEvent = {
      id: `cal_${Date.now()}`,
      title: newTitle.trim(),
      targetDate: eventDate,
      stage: newStage,
      contentMode: newMode,
      notes: newNotes.trim(),
    };

    saveEvents([newEvent, ...events]);
    setNewTitle('');
    setNewNotes('');
  };

  const handleDeleteEvent = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
  };

  const handleUpdateStage = (id: string, stage: CalendarEvent['stage']) => {
    saveEvents(events.map((e) => (e.id === id ? { ...e, stage } : e)));
  };

  const handleDownloadSchedule = () => {
    const text =
      `# YouTube Production Schedule — JARVIS Studio\n\n` +
      events
        .map(
          (e) =>
            `## ${e.title}\n- **Date:** ${e.targetDate}\n- **Stage:** ${e.stage}\n- **Mode:** ${e.contentMode}\n- **Notes:** ${e.notes || 'None'}\n`
        )
        .join('\n---\n\n');

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube_production_calendar_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = events.filter((e) => filterStage === 'All' || e.stage === filterStage);

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
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>Content Calendar & Planner</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                  PIPELINE HUD
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Track production stages, scheduled release dates, and pre-publication verification checklists
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadSchedule}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
            style={{ borderColor: 'rgba(0, 240, 255, 0.25)' }}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Calendar (.md)</span>
          </button>
        </div>
      </div>

      {/* Grid: New Schedule Entry Left + Calendar Feed Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Add Schedule Item & Publishing Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Add Scheduled Video Form */}
          <form
            onSubmit={handleAddEvent}
            className="p-5 rounded-2xl border space-y-3.5 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.25)' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Schedule New Video Production</span>
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                Video Topic / Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Deep Space Radio Burst Solved..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">
                  Target Release Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-200">
                  Current Stage
                </label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as CalendarEvent['stage'])}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
                >
                  <option value="Scripting">Scripting</option>
                  <option value="Storyboarding">Storyboarding</option>
                  <option value="Thumbnail">Thumbnail Studio</option>
                  <option value="Editing">YT Editor Timeline</option>
                  <option value="Ready to Publish">Ready to Publish</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                Content Style Mode
              </label>
              <select
                value={newMode}
                onChange={(e) => setNewMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
              >
                <option value="Science & Technology">Science & Technology</option>
                <option value="Documentary">Documentary</option>
                <option value="Explainer">Explainer</option>
                <option value="Professional News">Professional News</option>
                <option value="History">History</option>
                <option value="Business & Finance">Business & Finance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                Production Notes (Optional)
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                placeholder="Key dependencies, assets needed, or co-creator review..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-black shadow-md hover:opacity-90 active:scale-98 transition-all cursor-pointer"
              style={{ backgroundColor: '#00f0ff' }}
            >
              Add to Production Schedule
            </button>
          </form>

          {/* Pre-Publish Checklist Card */}
          <div
            className="p-5 rounded-2xl border space-y-3 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-Publish Verification Protocol</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">5 Checks</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'hookVerified', label: 'Hook Curiosity Verified (No pleasantries / 2s lock)' },
                { key: 'tagsUnder500', label: 'YouTube Tags strictly <= 500 characters' },
                { key: 'thumb16x9', label: 'High-contrast 16:9 Thumbnail rendered' },
                { key: 'audioBalanced', label: 'Voiceover loudness balanced over music' },
                { key: 'linksVerified', label: 'Citations and external source links verified' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center space-x-2.5 text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={(checklist as any)[item.key]}
                    onChange={(e) =>
                      setChecklist({ ...checklist, [item.key]: e.target.checked })
                    }
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Productions List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Production Pipeline ({events.length} Videos)</span>
            </span>

            <div className="flex items-center space-x-1">
              {['All', 'Scripting', 'Storyboarding', 'Editing', 'Ready to Publish'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                    filterStage === s ? 'text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: filterStage === s ? '#00f0ff' : 'transparent',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-2xl border space-y-2.5 transition-all hover:border-cyan-400/40 jarvis-panel"
                style={{ borderColor: 'rgba(0, 240, 255, 0.16)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{event.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                      📅 {event.targetDate}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {event.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed">{event.notes}</p>
                )}

                <div className="pt-2 border-t border-cyan-500/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Mode: {event.contentMode}
                  </span>

                  {/* Stage Switcher */}
                  <div className="flex items-center space-x-1">
                    {(['Scripting', 'Storyboarding', 'Editing', 'Ready to Publish', 'Published'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStage(event.id, st)}
                          className={`text-[10px] px-2 py-0.5 rounded transition-all cursor-pointer font-mono ${
                            event.stage === st
                              ? 'bg-cyan-400 text-black font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContentCalendarTab;
