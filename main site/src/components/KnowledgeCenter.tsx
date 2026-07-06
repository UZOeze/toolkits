import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, Calendar, ChevronDown, ChevronUp, Search, Tag, X, ArrowUpRight, Layers, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { knowledgeArticles, articleCategories, type ArticleCategory, type ArticleLevel, type KnowledgeArticle } from '../data/knowledgeArticles';

type SortMode = 'newest' | 'popular' | 'reading-time';

export default function KnowledgeCenter() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<ArticleLevel | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('popular');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // Filter & sort articles
  const filteredArticles = useMemo(() => {
    let list = [...knowledgeArticles];

    if (activeCategory !== 'all') {
      list = list.filter((a) => a.category === activeCategory);
    }

    if (activeLevel !== 'all') {
      list = list.filter((a) => a.level === activeLevel);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.keywords.some((k) => k.toLowerCase().includes(q)) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      case 'reading-time':
        list.sort((a, b) => a.readingTime - b.readingTime);
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return list;
  }, [search, activeCategory, activeLevel, sort]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [search, activeCategory, activeLevel, sort]);

  // Inject structured data for the currently expanded article
  useEffect(() => {
    if (!expandedSlug) return;
    const article = knowledgeArticles.find((a) => a.slug === expandedSlug);
    if (!article) return;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.featuredImage,
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate,
      author: { '@type': 'Organization', name: 'My Toolkits' },
      publisher: {
        '@type': 'Organization',
        name: 'My Toolkits',
        logo: { '@type': 'ImageObject', url: 'https://i.postimg.cc/J7Q25J5Y/new-logo.png' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://mytoolkits.com/#${article.slug}` },
      keywords: article.keywords.join(', '),
      articleSection: article.categoryLabel,
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    };

    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.dataset.kcArticle = article.slug;
    articleScript.text = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.dataset.kcFaq = article.slug;
    faqScript.text = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    return () => {
      articleScript.remove();
      faqScript.remove();
    };
  }, [expandedSlug]);

  const handleExpand = (slug: string) => {
    setExpandedSlug(expandedSlug === slug ? null : slug);
    if (expandedSlug !== slug) {
      // Scroll to the article smoothly
      setTimeout(() => {
        document.getElementById(`article-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    intermediate: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    advanced: 'bg-red-500/15 text-red-300 border-red-500/30',
  };

  return (
    <section id="knowledge-center" className="px-4 py-12 md:py-20">
      <div className="site-shell">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
            <BookOpen className="h-3.5 w-3.5" /> Knowledge Center
          </p>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-gold-gradient md:text-5xl">
            Trading Knowledge Center
          </h2>
          <p className="mx-auto max-w-2xl text-base text-yellow-200/70 md:text-lg">
            Learn professional trading, investing & betting with detailed guides covering Binary Options, Forex, Crypto, Sports Betting, Polymarket, and AI Trading.
          </p>
          <p className="mt-3 text-sm text-yellow-400/60">
            {knowledgeArticles.length} in-depth articles · Updated regularly · Free for everyone
          </p>
        </header>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative mx-auto max-w-2xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-400" />
            <input
              type="text"
              placeholder="Search articles, strategies, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full pl-14 pr-12"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-yellow-400/60 transition hover:bg-yellow-400/10 hover:text-yellow-300"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                activeCategory === 'all'
                  ? 'border-yellow-400 bg-yellow-400/20 text-yellow-200'
                  : 'border-yellow-500/30 bg-black/40 text-yellow-300/70 hover:border-yellow-400/60 hover:bg-yellow-400/10'
              }`}
            >
              All Categories
            </button>
            {articleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeCategory === cat.id
                    ? 'border-yellow-400 bg-yellow-400/20 text-yellow-200'
                    : 'border-yellow-500/30 bg-black/40 text-yellow-300/70 hover:border-yellow-400/60 hover:bg-yellow-400/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Level + Sort */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            {/* Level */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold uppercase tracking-wider text-yellow-500/70">Level:</span>
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setActiveLevel(lv)}
                  className={`rounded-md px-2.5 py-1 capitalize transition ${
                    activeLevel === lv
                      ? 'bg-yellow-400/20 text-yellow-200'
                      : 'text-yellow-400/60 hover:text-yellow-300'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>

            <span className="text-yellow-500/30">|</span>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold uppercase tracking-wider text-yellow-500/70">Sort:</span>
              {(
                [
                  { id: 'popular', label: 'Popular' },
                  { id: 'newest', label: 'Newest' },
                  { id: 'reading-time', label: 'Quick Reads' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSort(opt.id)}
                  className={`rounded-md px-2.5 py-1 transition ${
                    sort === opt.id
                      ? 'bg-yellow-400/20 text-yellow-200'
                      : 'text-yellow-400/60 hover:text-yellow-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-center text-xs text-yellow-400/50">
            {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} found
            {search && ` for "${search}"`}
          </p>
        </div>

        {/* Articles grid */}
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-black/40 p-12 text-center">
            <p className="text-yellow-300">No articles match your filters. Try a different search or clear filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                isExpanded={expandedSlug === article.slug}
                onToggle={() => handleExpand(article.slug)}
                levelColors={levelColors}
              />
            ))}
          </div>
        )}

        {/* Expanded article display below grid */}
        {expandedSlug && (() => {
          const article = knowledgeArticles.find((a) => a.slug === expandedSlug);
          if (!article) return null;
          return <ExpandedArticle article={article} onClose={() => setExpandedSlug(null)} />;
        })()}

        {/* Load more */}
        {visibleCount < filteredArticles.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 9)}
              className="rounded-xl border-2 border-yellow-500/50 bg-black/60 px-8 py-3 text-sm font-bold uppercase tracking-wider text-yellow-300 transition hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-200"
            >
              Load More Articles ({filteredArticles.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Article Card
// ─────────────────────────────────────────────
function ArticleCard({
  article,
  isExpanded,
  onToggle,
  levelColors,
}: {
  article: KnowledgeArticle;
  isExpanded: boolean;
  onToggle: () => void;
  levelColors: Record<string, string>;
}) {
  return (
    <article
      id={`article-${article.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-black/70 backdrop-blur-md transition-all duration-500 hover:translate-y-[-4px] ${
        isExpanded
          ? 'border-yellow-400 shadow-[0_0_35px_rgba(255,215,0,0.4)]'
          : 'border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]'
      }`}
    >
      {/* Featured image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={article.featuredImage}
          alt={article.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
            {article.categoryLabel}
          </span>
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelColors[article.level]}`}>
            {article.level}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug text-yellow-300 transition-colors group-hover:text-yellow-200">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-sm text-gray-400">{article.description}</p>

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between border-t border-yellow-500/15 pt-3 text-[11px] text-yellow-400/60">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <button
          onClick={onToggle}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2.5 text-sm font-black uppercase tracking-wider text-black transition hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        >
          {isExpanded ? (
            <>Hide Article <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>View Article <ArrowUpRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// Expanded Article (Accordion below grid)
// ─────────────────────────────────────────────
function ExpandedArticle({ article, onClose }: { article: KnowledgeArticle; onClose: () => void }) {
  const [showToc, setShowToc] = useState(true);

  // Build table of contents from H2 tags
  const toc = useMemo(() => {
    const matches = [...article.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
    return matches.map((m, idx) => ({
      id: `toc-${idx}`,
      title: m[1].replace(/<[^>]*>/g, ''),
    }));
  }, [article.content]);

  // Inject IDs into content for TOC scrolling
  const enhancedContent = useMemo(() => {
    let idx = 0;
    return article.content.replace(/<h2([^>]*)>/gi, (_, attrs) => `<h2${attrs} id="toc-${idx++}">`);
  }, [article.content]);

  const relatedArticles = useMemo(
    () => knowledgeArticles.filter((a) => article.relatedSlugs.includes(a.slug)),
    [article.relatedSlugs]
  );

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border-2 border-yellow-400/60 bg-black/85 shadow-[0_0_60px_rgba(255,215,0,0.25)] backdrop-blur-md">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <img src={article.featuredImage} alt={article.imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-yellow-500/50 bg-black/70 p-2 text-yellow-300 backdrop-blur transition hover:bg-yellow-400 hover:text-black"
          aria-label="Close article"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              {article.categoryLabel}
            </span>
            <span className="rounded-md border border-yellow-500/40 bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
              {article.level}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-yellow-400/70">
              <Clock className="h-3 w-3" /> {article.readingTime} min read
            </span>
            <span className="flex items-center gap-1 text-[11px] text-yellow-400/70">
              <Calendar className="h-3 w-3" /> {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight text-yellow-300 md:text-4xl">{article.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-300 md:text-base">{article.description}</p>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div>
          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-yellow-300/90">
                <Tag className="h-2.5 w-2.5" /> {tag}
              </span>
            ))}
          </div>

          {/* Article HTML content */}
          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: enhancedContent }} />

          {/* FAQ Section */}
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-black text-yellow-400">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
                <FaqItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-2xl font-black text-yellow-400">Continue Reading</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {relatedArticles.map((rel) => (
                  <a
                    key={rel.slug}
                    href={`#article-${rel.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      setTimeout(() => {
                        document.getElementById(`article-${rel.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                    className="group flex gap-3 rounded-xl border border-yellow-500/25 bg-black/40 p-3 transition hover:border-yellow-400/60 hover:bg-yellow-400/5"
                  >
                    <img src={rel.featuredImage} alt={rel.imageAlt} loading="lazy" className="h-16 w-20 flex-shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400/70">{rel.categoryLabel}</p>
                      <h4 className="line-clamp-2 text-sm font-bold text-yellow-300 transition group-hover:text-yellow-200">{rel.title}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Table of Contents */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-yellow-500/30 bg-black/60 p-4">
            <button
              onClick={() => setShowToc((v) => !v)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-yellow-400">
                <Layers className="h-4 w-4" /> Table of Contents
              </span>
              {showToc ? <ChevronUp className="h-4 w-4 text-yellow-400" /> : <ChevronDown className="h-4 w-4 text-yellow-400" />}
            </button>

            {showToc && (
              <ol className="mt-3 space-y-1.5 text-sm">
                {toc.map((item, idx) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="block rounded px-2 py-1 text-yellow-300/80 transition hover:bg-yellow-400/10 hover:text-yellow-200"
                    >
                      <span className="text-yellow-500/50">{idx + 1}.</span> {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Keywords */}
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-black/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-yellow-400">
              <TrendingUpIcon className="h-4 w-4" /> SEO Keywords
            </p>
            <div className="flex flex-wrap gap-1.5">
              {article.keywords.map((kw) => (
                <span key={kw} className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-300/70">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ Accordion Item
// ─────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-yellow-500/25 bg-black/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-yellow-400/5"
      >
        <span className="font-bold text-yellow-300">{question}</span>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-yellow-400" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-yellow-400" />}
      </button>
      {open && (
        <div className="border-t border-yellow-500/15 px-4 py-3 text-sm leading-relaxed text-gray-300">{answer}</div>
      )}
    </div>
  );
}
