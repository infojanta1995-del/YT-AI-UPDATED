import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight,
  Flame,
  Clock,
  Compass,
  Filter,
  Layers,
  CheckCircle2,
  ExternalLink,
  Clapperboard,
} from 'lucide-react';

interface TrendItem {
  id: string;
  topic: string;
  category: 'Tech & AI' | 'Science & Space' | 'Business & Finance' | 'Explainers' | 'History & Mystery';
  hookAngle: string;
  recommendedMode: string;
  keySearchQueries: string[];
  observedDate: string;
  retentionRating: 'Ultra High' | 'High' | 'Rising';
  whyItWorks: string;
}

const TREND_DATABASE: TrendItem[] = [
  {
    id: 'trend-1',
    topic: 'How Silicon Transistors Hit Quantum Limits & What Replaces Them',
    category: 'Tech & AI',
    hookAngle: 'Show why chips smaller than 2 nanometers start leaking electrons due to quantum tunneling, and why 2D materials like MoS2 are the only cure.',
    recommendedMode: 'Science & Technology',
    keySearchQueries: ['2nm quantum tunneling', 'silicon transistor limits', '2D semiconductors 2026'],
    observedDate: 'Current Active',
    retentionRating: 'Ultra High',
    whyItWorks: 'Direct physical dilemma with high technological stakes; viewers love seeing why their phone hardware is fundamentally changing.',
  },
  {
    id: 'trend-2',
    topic: 'James Webb Space Telescope Found Atmosphere Anomalies on TRAPPIST-1e',
    category: 'Science & Space',
    hookAngle: 'Focus on transmission spectroscopy detecting carbon dioxide without methane, challenging conventional exoplanet greenhouse models.',
    recommendedMode: 'Documentary',
    keySearchQueries: ['JWST TRAPPIST 1e atmosphere', 'exoplanet biosignatures', 'James Webb latest findings'],
    observedDate: 'Current Active',
    retentionRating: 'Ultra High',
    whyItWorks: 'Deep space mysteries consistently hold the highest 60-second completion rates on YouTube Shorts.',
  },
  {
    id: 'trend-3',
    topic: 'Why Commercial Airplanes Never Fly Straight Across the Pacific Ocean',
    category: 'Explainers',
    hookAngle: 'Debunk the visual map illusion using spherical Great Circle Geometry and ETOPS 180 engine redundancy rules.',
    recommendedMode: 'Explainer',
    keySearchQueries: ['why planes dont fly over pacific', 'great circle navigation routes', 'ETOPS aviation rules'],
    observedDate: 'Current Active',
    retentionRating: 'High',
    whyItWorks: 'Everyday counter-intuitive truth that viewers immediately test and share in comments.',
  },
  {
    id: 'trend-4',
    topic: 'Solid-State Battery Breakthrough: Ceramic Electrolytes vs Lithium Dendrites',
    category: 'Business & Finance',
    hookAngle: 'Compare why liquid electrolytes catch fire under micro-puncture while ceramic separators survive 1,000+ rapid charge cycles.',
    recommendedMode: 'Business & Finance',
    keySearchQueries: ['solid state battery commercial timeline', 'EV battery dendrite solution', 'lithium metal vs lithium ion'],
    observedDate: 'Current Active',
    retentionRating: 'Rising',
    whyItWorks: 'Mass consumer interest in electric cars paired with engineering breakthroughs.',
  },
  {
    id: 'trend-5',
    topic: 'The 1977 Wow! Signal: Cometary Hydrogen Cloud or Extraterrestrial Beacon?',
    category: 'History & Mystery',
    hookAngle: 'Detail the exact 72-second signal window matching the Big Ear antenna horns, and analyze the recent 2024 maser radiation study.',
    recommendedMode: 'Mystery & Investigation',
    keySearchQueries: ['Wow signal explanation 2024', 'Big Ear radio telescope mystery', 'alien radio signal debunked'],
    observedDate: 'Current Active',
    retentionRating: 'Ultra High',
    whyItWorks: 'Authentic unresolved historical mystery with rigorous scientific evidence.',
  },
  {
    id: 'trend-6',
    topic: 'How the Apollo 11 Guidance Computer Survived the 1202 Program Alarm',
    category: 'History & Mystery',
    hookAngle: 'Explain how Margaret Hamilton’s asynchronous priority scheduling discarded non-critical radar cycles seconds before landing on the Sea of Tranquility.',
    recommendedMode: 'History',
    keySearchQueries: ['Apollo 11 1202 alarm explained', 'Margaret Hamilton software engineering', 'Apollo guidance computer rope memory'],
    observedDate: 'Current Active',
    retentionRating: 'High',
    whyItWorks: 'Extreme tension in a legendary moment combined with software engineering triumph.',
  },
];

interface TrendRadarTabProps {
  userId: string;
  onSelectTrendForScript?: (trend: { topic: string; mode: string; angle: string }) => void;
}

export const TrendRadarTab: React.FC<TrendRadarTabProps> = ({
  userId,
  onSelectTrendForScript,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrends = TREND_DATABASE.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.topic.toLowerCase().includes(q) ||
      item.hookAngle.toLowerCase().includes(q) ||
      item.keySearchQueries.some((k) => k.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
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
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                <span>Creator Trend Radar</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                  RADAR SCAN
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Curated high-retention YouTube topics, verified scientific angles, and direct 1-click script generation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Telemetry: Live Curated Feed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Tech & AI', 'Science & Space', 'Explainers', 'Business & Finance', 'History & Mystery'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'text-black font-bold'
                    : 'text-slate-400 hover:text-white border'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? '#00f0ff' : 'rgba(9, 15, 29, 0.6)',
                  borderColor: selectedCategory === cat ? '#00f0ff' : 'rgba(0, 240, 255, 0.15)',
                }}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trend topics..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
          />
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className="p-5 rounded-2xl border space-y-3.5 flex flex-col justify-between transition-all hover:border-cyan-400/40 jarvis-panel"
            style={{ borderColor: 'rgba(0, 240, 255, 0.18)' }}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {trend.category}
                </span>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor:
                      trend.retentionRating === 'Ultra High'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(56, 189, 248, 0.15)',
                    borderColor:
                      trend.retentionRating === 'Ultra High'
                        ? 'rgba(239, 68, 68, 0.4)'
                        : 'rgba(56, 189, 248, 0.4)',
                    color: trend.retentionRating === 'Ultra High' ? '#f87171' : '#38bdf8',
                  }}
                >
                  🔥 {trend.retentionRating} Retention
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {trend.topic}
              </h3>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Recommended Hook Angle
                </span>
                <p className="leading-relaxed">{trend.hookAngle}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Search Query Demand:
                </span>
                <div className="flex flex-wrap gap-1">
                  {trend.keySearchQueries.map((q, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      #{q}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Mode: <span className="text-cyan-300 font-semibold">{trend.recommendedMode}</span>
              </span>

              {onSelectTrendForScript && (
                <button
                  type="button"
                  onClick={() =>
                    onSelectTrendForScript({
                      topic: trend.topic,
                      mode: trend.recommendedMode,
                      angle: trend.hookAngle,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-black flex items-center space-x-1.5 transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
                  style={{ backgroundColor: '#00f0ff' }}
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Create Script &rarr;</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TrendRadarTab;
