import { useEffect, useState } from 'react';
import { Binary, ChevronLeft, ChevronRight, Coins, TrendingUp, Trophy, Lightbulb, BarChart3 } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  binary: Binary,
  crypto: Coins,
  forex: TrendingUp,
  sports: Trophy,
  polymarket: BarChart3,
  insights: Lightbulb,
};

interface BlogSlidesProps {
  onSelectCategory: (id: string) => void;
}

export default function BlogSlides({ onSelectCategory }: BlogSlidesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePost = blogPosts[activeIndex];
  const ActiveIcon = icons[activePost.categoryId] || Binary;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % blogPosts.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const moveSlide = (direction: number) => {
    setActiveIndex((current) => (current + direction + blogPosts.length) % blogPosts.length);
  };

  return (
    <section className="px-4 py-6 md:py-8">
      <div className="site-shell">


        <div className="relative mx-auto w-full max-w-[960px] overflow-hidden rounded-3xl border-2 border-yellow-500/50 bg-black/85 p-8 shadow-[0_0_55px_rgba(255,215,0,0.2)] backdrop-blur-md md:p-14 lg:translate-x-40 xl:translate-x-48">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.18),transparent_45%)]" />

          <button
            onClick={() => moveSlide(-1)}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-yellow-500/50 bg-black/80 p-3 text-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition hover:bg-yellow-400 hover:text-black md:left-5"
            aria-label="Previous blog slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => moveSlide(1)}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-yellow-500/50 bg-black/80 p-3 text-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition hover:bg-yellow-400 hover:text-black md:right-5"
            aria-label="Next blog slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative mx-auto flex w-full flex-col items-center justify-center px-10 text-center transition-all duration-500 md:px-16">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_28px_rgba(255,215,0,0.25)] md:h-24 md:w-24">
              <ActiveIcon className="h-10 w-10 text-yellow-400 md:h-12 md:w-12" />
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-yellow-500/70">
              SLIDE {activeIndex + 1} OF {blogPosts.length}
            </p>
            <h3 className="mb-3 text-center text-3xl font-black text-yellow-400 md:text-5xl">
              {activePost.category}
            </h3>
            <p className="mx-auto mb-5 max-w-2xl text-center text-base text-gray-300 md:text-lg">
              {activePost.articles.length} SEO articles · {activePost.tools.length} professional tools covered with full guides, FAQs and strategies.
            </p>

            <div className="mb-7 flex flex-wrap justify-center gap-2 text-center">
              {activePost.tools.slice(0, 8).map((tool) => (
                <span key={tool} className="rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-200/90">
                  {tool}
                </span>
              ))}
              {activePost.tools.length > 8 && (
                <span className="rounded-full px-3 py-1.5 text-xs text-yellow-500/80">+{activePost.tools.length - 8} more tools</span>
              )}
            </div>

            <div className="flex justify-center">
              <button className="gold-btn btn-shine px-10 py-4" onClick={() => onSelectCategory(activePost.categoryId)}>
                READ FULL BLOG
              </button>
            </div>
          </div>

          <div className="relative mt-8 flex justify-center gap-3">
            {blogPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-12 bg-yellow-400' : 'w-2.5 bg-yellow-500/35 hover:bg-yellow-500/70'}`}
                aria-label={`Show ${post.category} blog slide`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
