import { Binary, Coins, TrendingUp, Trophy, BarChart3, Play, Newspaper } from 'lucide-react';

interface NavButton {
  id: string;
  title: string;
  /** Local HTML file (from /public). Replace after export. */
  file: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Each tab points to a local HTML file in /public.
 * After running `npm run build`, these files appear in /dist as separate
 * static HTML pages you can freely replace with your final content.
 *
 *   public/binaryoption.html  →  Binary Option Toolkits
 *   public/crypto.html        →  Crypto Trading Toolkits
 *   public/forex.html         →  Forex Trading Toolkits
 *   public/polymarket.html    →  Polymarket Toolkits
 *   public/sports.html        →  Sports Betting Toolkits
 *   public/blogs.html         →  MY-TOOLKITS BLOGSPOTS
 *   public/videos.html        →  Videos
 */
export const toolkitTabs: NavButton[] = [
  { id: 'binary',     title: 'Binary Option Toolkits',   file: '/binaryoption.html', icon: Binary },
  { id: 'crypto',     title: 'Crypto Trading Toolkits',  file: '/crypto.html',       icon: Coins },
  { id: 'forex',      title: 'Forex Trading Toolkits',   file: '/forex.html',        icon: TrendingUp },
  { id: 'polymarket', title: 'Polymarket Toolkits',      file: '/polymarket.html',   icon: BarChart3 },
  { id: 'sports',     title: 'Sports Betting Toolkits',  file: '/sports.html',       icon: Trophy },
  { id: 'blogs',      title: 'MY-TOOLKITS BLOGSPOTS',    file: '/blogs.html',        icon: Newspaper },
  { id: 'videos',     title: 'Videos',                   file: '/videos.html',       icon: Play },
];

interface NavigationProps {
  onSelectToolkit: (id: string) => void;
  activeToolkit?: string;
}

export default function Navigation({ onSelectToolkit, activeToolkit }: NavigationProps) {
  return (
    <nav className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-[1480px] px-6 lg:translate-x-36 xl:translate-x-48">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {toolkitTabs.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSelectToolkit(id)}
              className={`gold-btn btn-shine flex items-center justify-center gap-2 px-4 py-6 text-center ${activeToolkit === id ? 'ring-2 ring-yellow-200 ring-offset-2 ring-offset-black' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm md:text-base leading-tight font-bold tracking-wide">{title}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
