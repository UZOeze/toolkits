import { useState } from 'react';
import { Binary, Coins, TrendingUp, Trophy, Lightbulb, BarChart3, ChevronDown, ChevronUp, Search, ArrowLeft, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blogData';

interface BlogSearchProps {
  onBack: () => void;
  highlightPost?: string;
}

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  binary: Binary,
  crypto: Coins,
  forex: TrendingUp,
  sports: Trophy,
  polymarket: BarChart3,
  insights: Lightbulb,
};

export default function BlogSearch({ onBack, highlightPost }: BlogSearchProps) {
  const initialExpanded = blogPosts.find(
    (p) => p.id === highlightPost || p.categoryId === highlightPost
  )?.id || null;

  const [expandedCategory, setExpandedCategory] = useState<string | null>(initialExpanded);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const filteredPosts = blogPosts.filter((post) =>
    post.category.toLowerCase().includes(filter.toLowerCase()) ||
    post.tools.some((t) => t.toLowerCase().includes(filter.toLowerCase())) ||
    post.seoKeywords.some((k) => k.toLowerCase().includes(filter.toLowerCase())) ||
    post.articles.some((a) => a.tool.toLowerCase().includes(filter.toLowerCase()))
  );

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedArticle(null);
  };

  const toggleArticle = (id: string) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="page-transition px-4 py-8">
      <div className="site-shell">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-yellow-500/40 px-4 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h2 className="flex-1 text-center text-4xl font-black text-gold-gradient md:text-5xl">
            Blog Search
          </h2>
          <div className="w-24" />
        </div>

        {/* Search Filter */}
        <div className="relative mx-auto mb-10 max-w-xl">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            placeholder="Search tools, topics, keywords..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input w-full pl-14"
          />
        </div>

        {/* Category Cards */}
        <div className="space-y-5">
          {filteredPosts.map((post) => {
            const Icon = icons[post.categoryId] || Binary;
            const isCatOpen = expandedCategory === post.id;

            const filteredArticles = post.articles.filter(
              (a) =>
                filter === '' ||
                a.tool.toLowerCase().includes(filter.toLowerCase()) ||
                a.content.toLowerCase().includes(filter.toLowerCase())
            );

            return (
              <div key={post.id} className="gold-border-card overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(post.id)}
                  className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-yellow-500/5 md:p-6"
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 border-yellow-500/40 bg-yellow-500/10">
                    <Icon className="h-7 w-7 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-xl font-black text-yellow-400">{post.category} Blogs</h3>
                    <p className="text-sm text-gray-400">{post.articles.length} detailed SEO articles · {post.tools.length} tools covered</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-green-400">
                      {isCatOpen ? 'Click to collapse' : 'Click to expand all blogs →'}
                    </p>
                  </div>
                  {isCatOpen
                    ? <ChevronUp className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                    : <ChevronDown className="h-6 w-6 flex-shrink-0 text-yellow-400" />}
                </button>

                {/* Expanded: list of articles */}
                <div className={`expand-enter ${isCatOpen ? 'open' : ''}`}>
                  <div className="border-t border-yellow-500/20 px-4 py-4 md:px-6 md:py-5">
                    {/* SEO Keywords */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.seoKeywords.slice(0, 6).map((k) => (
                        <span key={k} className="rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-[11px] italic text-yellow-400/70">
                          #{k}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {(filter ? filteredArticles : post.articles).map((article) => {
                        const isArticleOpen = expandedArticle === `${post.id}-${article.id}`;
                        return (
                          <div key={article.id} className="overflow-hidden rounded-xl border border-yellow-500/20 bg-black/40">
                            {/* Article Header */}
                            <button
                              onClick={() => toggleArticle(`${post.id}-${article.id}`)}
                              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-yellow-500/5"
                            >
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 flex-shrink-0 text-yellow-400" />
                                <span className="font-bold text-yellow-300">{article.tool}</span>
                              </div>
                              {isArticleOpen
                                ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                                : <ChevronDown className="h-4 w-4 flex-shrink-0 text-yellow-500" />}
                            </button>

                            {/* Article Full Content */}
                            <div className={`expand-enter ${isArticleOpen ? 'open' : ''}`}>
                              <div className="border-t border-yellow-500/10 px-4 py-5 md:px-6">
                                <div
                                  className="prose-blog max-h-[600px] overflow-y-auto pr-2"
                                  dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filter && filteredArticles.length === 0 && (
                      <p className="py-6 text-center text-yellow-400/60">No articles match "{filter}" in this category.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-xl text-yellow-400">No blogs found matching "{filter}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
