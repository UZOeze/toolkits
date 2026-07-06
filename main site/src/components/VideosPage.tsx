import { ArrowLeft, Play, ExternalLink } from 'lucide-react';

const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const YtIconSm = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

interface VideosPageProps {
  onBack: () => void;
}

const channels = [
  {
    name: 'CryptoRocket YouTube',
    url: 'https://www.youtube.com/@cryptorocket',
    IconComp: YtIcon,
    description: 'Full trading tutorials, toolkit walkthroughs, live signal sessions, and strategy guides.',
    color: '#FF0000',
  },
  {
    name: 'TikTok – @cryptorocket__1',
    url: 'https://www.tiktok.com/@cryptorocket__1',
    IconComp: TkIcon,
    description: 'Short-form trading tips, quick strategy clips, and live tool demonstrations.',
    color: '#ff0050',
  },
];

const upcomingVideos = [
  { title: 'How to Use the AI Signal Tool for Binary Options', category: 'Binary Options' },
  { title: 'Crypto P2P Arbitrage: Step-by-Step Live Walkthrough', category: 'Crypto' },
  { title: 'Forex Position Sizing Calculator – Full Tutorial', category: 'Forex' },
  { title: 'Polymarket Toolkit: EV & Kelly Criterion Deep Dive', category: 'Polymarket' },
  { title: 'Sports Betting Bankroll Management Masterclass', category: 'Sports Betting' },
  { title: 'Triangular Arbitrage on Binance – Live Trade', category: 'Crypto' },
  { title: 'Binary Options Risk Calculator Explained', category: 'Binary Options' },
  { title: 'Forex Prop Firm Challenge – Simulator Tutorial', category: 'Forex' },
  { title: 'Solana & Altcoin DCA Strategy 2026', category: 'Crypto' },
];

const categoryColors: Record<string, string> = {
  'Binary Options': '#FFD700',
  'Crypto': '#C7C7D6',
  'Forex': '#7FE8FF',
  'Polymarket': '#B48CFF',
  'Sports Betting': '#8DE38D',
};

export default function VideosPage({ onBack }: VideosPageProps) {
  return (
    <main className="page-transition px-4 py-8">
      <div className="site-shell">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h2 className="flex-1 text-center text-4xl font-black text-gold-gradient md:text-5xl">
            Videos
          </h2>
          <div className="w-24" />
        </div>

        {/* Upload notice banner */}
        <div className="mb-10 overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-black/60 p-8 text-center backdrop-blur-md">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-5 py-2 text-xs font-black uppercase tracking-widest text-yellow-300">
              <Play className="h-3.5 w-3.5" /> New Videos Uploading Soon
            </span>
          </div>
          <h3 className="mb-3 text-2xl font-black text-yellow-300 md:text-3xl">
            Professional Trading Video Library
          </h3>
          <p className="mx-auto max-w-2xl text-base text-gray-400">
            Full-length trading tutorials, live signal sessions, tool walkthroughs, and strategy guides
            across Binary Options, Crypto, Forex, Sports Betting, and Polymarket — all powered by CryptoRocket.
          </p>
        </div>

        {/* Follow channels */}
        <section className="mb-12">
          <h3 className="mb-5 text-xl font-black uppercase tracking-widest text-yellow-400">
            Follow Our Channels
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {channels.map(({ name, url, IconComp, description, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group gold-border-card flex items-start gap-4 p-5 transition"
              >
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110"
                  style={{ backgroundColor: `${color}22`, border: `2px solid ${color}55` }}
                >
                  <span style={{ color }}>
                    <IconComp />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 font-black text-yellow-300 transition group-hover:text-yellow-200">{name}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-yellow-500/60 transition group-hover:text-yellow-400" />
              </a>
            ))}
          </div>
        </section>

        {/* Upcoming videos grid */}
        <section>
          <h3 className="mb-5 text-xl font-black uppercase tracking-widest text-yellow-400">
            Upcoming Videos
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcomingVideos.map((video) => {
              const catColor = categoryColors[video.category] || '#FFD700';
              return (
                <div
                  key={video.title}
                  className="gold-border-card group flex flex-col overflow-hidden"
                >
                  {/* Thumbnail placeholder */}
                  <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-black to-yellow-900/15">
                    {/* Subtle animated grid lines for "terminal" feel */}
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                      }}
                    />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-400/40 bg-black/60 transition group-hover:border-yellow-400 group-hover:bg-yellow-400/10 group-hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                      <Play className="h-6 w-6 translate-x-0.5 text-yellow-400" />
                    </div>
                    <span
                      className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: `${catColor}22`,
                        color: catColor,
                        border: `1px solid ${catColor}55`,
                      }}
                    >
                      {video.category}
                    </span>
                    <span className="absolute left-3 top-3 rounded-full border border-yellow-500/30 bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-yellow-300/80">
                      Coming Soon
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="mb-3 text-sm font-bold leading-snug text-yellow-200 transition group-hover:text-yellow-100">
                      {video.title}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs text-yellow-500/60">
                      <Play className="h-3 w-3" /> Subscribe to be notified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Subscribe CTA */}
        <div className="mt-14 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-black to-yellow-900/10 p-10 text-center">
          <h3 className="mb-2 text-2xl font-black text-yellow-300">Never Miss a Video</h3>
          <p className="mb-6 text-gray-400">
            Subscribe to the CryptoRocket YouTube channel for the latest trading tutorials and live tool sessions.
          </p>
          <a
            href="https://www.youtube.com/@cryptorocket"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-btn btn-shine inline-flex items-center gap-3 px-8 py-4"
          >
            <YtIconSm />
            Subscribe on YouTube
          </a>
        </div>

      </div>
    </main>
  );
}
