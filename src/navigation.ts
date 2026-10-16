import {
  LayoutDashboard,
  FileText,
  Clapperboard,
  Layers,
  Film,
  Search,
  Image as ImageIcon,
  Scissors,
  Mic,
  TrendingUp,
  Calendar,
  FolderKanban,
  KeyRound,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavigationPageId =
  | 'overview'
  | 'sources'
  | 'scripts'
  | 'storyboard'
  | 'video-prompts'
  | 'thumbnail-studio'
  | 'seo-studio'
  | 'yt-editor'
  | 'voice-audio'
  | 'trend-radar'
  | 'calendar'
  | 'projects'
  | 'api-keys'
  | 'settings';

export interface NavigationItem {
  id: NavigationPageId;
  label: string;
  badge?: string;
  description: string;
  icon: LucideIcon;
  category?: 'core' | 'intelligence' | 'system';
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'overview',
    label: 'JARVIS Command',
    description: 'Central AI Command Center, reactive core, and production pipeline overview',
    icon: LayoutDashboard,
    category: 'core',
  },
  {
    id: 'sources',
    label: 'Research & Sources',
    description: 'Saved articles, research notes, citations, and plain text reference library',
    icon: FileText,
    category: 'core',
  },
  {
    id: 'scripts',
    label: 'Script Generator',
    description: 'Topic & Article-to-Video Script Generator with 12 modes & locked gemini-3.8-flash',
    badge: 'AI',
    icon: Clapperboard,
    category: 'core',
  },
  {
    id: 'storyboard',
    label: 'Storyboard Planner',
    description: 'Scene-by-scene visual board, shot composition, camera movement & lighting notes',
    badge: 'NEW',
    icon: Layers,
    category: 'core',
  },
  {
    id: 'video-prompts',
    label: 'Video Prompt Builder',
    description: 'Google Flow & Veo visual prompts mapped strictly to script segments',
    badge: 'Flow',
    icon: Film,
    category: 'core',
  },
  {
    id: 'thumbnail-studio',
    label: 'Thumbnail Studio',
    description: 'Cinematic 16:9 YouTube Thumbnails, Prompt Engineering & Live Studio Designer',
    badge: 'Studio',
    icon: ImageIcon,
    category: 'core',
  },
  {
    id: 'seo-studio',
    label: 'SEO Studio',
    description: 'YouTube Titles, Description, Tags (<=500 chars), Keywords & Thumbnail Strategy',
    badge: 'SEO',
    icon: Search,
    category: 'core',
  },
  {
    id: 'yt-editor',
    label: 'YT EDITOR',
    description: 'Professional non-linear video editing studio with timeline, multi-track, inspector & real export',
    badge: 'PRO',
    icon: Scissors,
    category: 'core',
  },
  {
    id: 'voice-audio',
    label: 'Voice & Audio',
    description: 'Browser speech synthesis voiceover audition, multi-voice selection, rate & pitch controls',
    badge: 'Audio',
    icon: Mic,
    category: 'intelligence',
  },
  {
    id: 'trend-radar',
    label: 'Trend Radar',
    description: 'Real YouTube creator niche trends, viral topic angles, and direct 1-click script creation',
    badge: 'Radar',
    icon: TrendingUp,
    category: 'intelligence',
  },
  {
    id: 'calendar',
    label: 'Content Calendar',
    description: 'Production schedule, video publication checklist, and pipeline status planner',
    icon: Calendar,
    category: 'intelligence',
  },
  {
    id: 'projects',
    label: 'Project Library',
    description: 'Central project library, drafts, version tracking, and quick resume',
    icon: FolderKanban,
    category: 'intelligence',
  },
  {
    id: 'api-keys',
    label: 'API Configuration',
    description: 'Encrypted Gemini API key credentials and official developer portal links',
    icon: KeyRound,
    category: 'system',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Appearance presets, dark/light theme modes, and workspace preferences',
    icon: Settings,
    category: 'system',
  },
];
