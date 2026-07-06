import { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import CryptoShootingStars from './components/CryptoShootingStars';
import GoldCursor from './components/GoldCursor';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BlogSlides from './components/BlogSlides';
import BlogSearch from './components/BlogSearch';
import Footer from './components/Footer';
import ToolkitLoader from './components/ToolkitLoader';
import LegalPages from './components/LegalPages';
import { BackToTop, ScrollAnimations } from './components/Extras';
import BuyPremiumButton from './components/BuyPremiumButton';
import KnowledgeCenter from './components/KnowledgeCenter';

type Page = 'home' | 'blog' | 'legal';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [legalPage, setLegalPage] = useState<string>('about');
  const [highlightPost, setHighlightPost] = useState<string | undefined>();
  const [activeToolkit, setActiveToolkit] = useState<string | undefined>();

  const goToBlogSearch = (postId?: string) => {
    setHighlightPost(postId);
    setActiveToolkit(undefined);
    setPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadToolkit = (id: string) => {
    setActiveToolkit(id);
    setPage('home');
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setPage('home');
    setHighlightPost(undefined);
    setActiveToolkit(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (legalId: string) => {
    setLegalPage(legalId);
    setPage('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'My Toolkits | Professional Trading & Betting Toolkits by CryptoRocket',
      blog: 'Blog Search | My Toolkits - Professional Trading & Betting',
      legal: `${legalPage.charAt(0).toUpperCase() + legalPage.slice(1)} | My Toolkits`,
    };
    document.title = titles[page] || titles.home;
  }, [page, legalPage]);

  // When a toolkit tab is open, show only the full-screen embedded sub-page
  if (activeToolkit) {
    return <ToolkitLoader activeToolkit={activeToolkit} onClose={() => setActiveToolkit(undefined)} />;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1920px] text-white">
      <AnimatedBackground />
      <CryptoShootingStars />
      <GoldCursor />
      <ScrollAnimations />

      <Header onHome={goHome} />

      {/* spacer: header → tabs */}
      <div className="h-10 md:h-16" />

      <Navigation
        onSelectToolkit={loadToolkit}
        activeToolkit={activeToolkit}
      />

      {/* spacer: tabs → content */}
      <div className="h-10 md:h-16" />

      {page === 'home' && (
        <main className="page-transition">
          <BlogSlides onSelectCategory={(id) => goToBlogSearch(id)} />
          <KnowledgeCenter />
        </main>
      )}

      {page === 'blog' && (
        <main>
          <BlogSearch onBack={goHome} highlightPost={highlightPost} />
        </main>
      )}

      {page === 'legal' && (
        <LegalPages page={legalPage} onBack={goHome} />
      )}

      {/* spacer: content → footer */}
      <div className="h-10 md:h-16" />

      <Footer onNavigate={navigateTo} />
      <BackToTop />
      <BuyPremiumButton />
    </div>
  );
}
