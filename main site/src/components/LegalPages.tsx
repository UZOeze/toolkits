import { ArrowLeft } from 'lucide-react';

interface LegalPagesProps {
  page: string;
  onBack: () => void;
}

const pages: Record<string, { title: string; content: string }> = {
  about: {
    title: 'About Us',
    content: `<h1>About Us</h1>
<h2>Who We Are</h2>
<p>Welcome to <strong>Trading Toolkits</strong> — your all-in-one hub for smarter trading and strategic betting decisions. We are a dedicated team of traders, analysts, and technology enthusiasts who understand firsthand the challenges of navigating financial markets and sports betting without the right resources.</p>
<p>Our platform was built on a single belief: that every trader and bettor, regardless of experience level, deserves access to professional-grade tools that simplify analysis, sharpen strategy, and improve decision-making.</p>

<h2>What We Offer</h2>
<p>Trading Toolkits brings together four powerful suites under one roof:</p>
<p><strong>Binary Option Toolkit</strong><br>A comprehensive set of tools designed to help binary options traders evaluate trade setups, manage risk, calculate expiry timing, and monitor market signals with greater precision and confidence.</p>
<p><strong>Crypto Trading Toolkit</strong><br>Built for the fast-paced world of digital assets, our crypto toolkit provides real-time analytics helpers, coin performance trackers, volatility indicators, portfolio balance calculators, and trend monitoring utilities to keep you ahead of the curve.</p>
<p><strong>Forex Trading Toolkit</strong><br>Navigate the world's largest financial market with our Forex suite — featuring pip calculators, lot size tools, currency correlation matrices, margin calculators, risk/reward analyzers, and economic event references to support your daily trading decisions.</p>
<p><strong>Sports Betting Toolkit</strong><br>From odds converters and implied probability calculators to bankroll managers and arbitrage finders, our Sports Betting suite gives bettors the analytical edge needed to make data-driven wagers across football, basketball, tennis, and more.</p>

<h2>Our Mission</h2>
<p>Our mission is to democratize access to high-quality trading and betting tools. We are committed to continuous improvement, adding new features based on community feedback and evolving market conditions. Whether you are a beginner learning the ropes or a seasoned professional refining your edge, Trading Toolkits is built for you.</p>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  contact: {
    title: 'Contact Us',
    content: `<h1>Contact Us</h1>
<p>We would love to hear from you — whether it is a question about our tools, a technical issue, a partnership inquiry, or general feedback. Our team is available and responsive.</p>

<h2>Get in Touch</h2>
<ul>
<li><strong>Email:</strong> support@tradingtoolkits.com</li>
<li><strong>Business Inquiries:</strong> partnerships@tradingtoolkits.com</li>
<li><strong>Technical Support:</strong> tech@tradingtoolkits.com</li>
</ul>

<h2>Contact Form</h2>
<p>You can reach us directly through the contact form on our website. Please include the following details so we can assist you faster:</p>
<ul>
<li>Your name</li>
<li>Your email address</li>
<li>The toolkit you are inquiring about (Binary Options, Crypto, Forex, or Sports Betting)</li>
<li>A clear description of your question or issue</li>
</ul>

<h2>Response Time</h2>
<p>We typically respond to all inquiries within <strong>24 to 48 business hours</strong>. For urgent technical issues, please mark your subject line as "URGENT" and we will prioritize your message.</p>

<h2>Social Media</h2>
<p>Follow us on our social channels for updates, tips, and tool announcements:</p>
<ul>
<li><strong>Twitter/X:</strong> @TradingToolkits</li>
<li><strong>Telegram:</strong> t.me/TradingToolkits</li>
<li><strong>YouTube:</strong> youtube.com/TradingToolkits</li>
</ul>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  privacy: {
    title: 'Privacy Policy',
    content: `<p style="opacity:0.7;font-style:italic;margin-bottom:1rem;">Last Updated: June 2025</p>
<h1>Privacy Policy</h1>

<h2>1. Introduction</h2>
<p>Trading Toolkits ("we," "our," or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have regarding your data when you visit our website and use our tools.</p>

<h2>2. Information We Collect</h2>
<p><strong>Information You Provide to Us</strong><br>We collect information you voluntarily provide when you contact us, register for an account, or subscribe to our newsletter. This may include your name, email address, and any messages you send us.</p>
<p><strong>Information Automatically Collected</strong><br>When you visit our website, certain information is collected automatically, including IP address, browser type, device information, operating system, pages visited, time spent, referring URLs, and cookies.</p>
<p><strong>Third-Party Data</strong><br>We may receive information about you from third-party services such as Google Analytics, advertising partners, or social media platforms.</p>

<h2>3. How We Use Your Information</h2>
<ul>
<li>To operate and maintain our website and toolkits</li>
<li>To respond to your inquiries and provide customer support</li>
<li>To send periodic emails, newsletters, and product updates (with your consent)</li>
<li>To analyze usage patterns and improve our tools and services</li>
<li>To detect, prevent, and address technical issues or abuse</li>
<li>To comply with applicable legal obligations</li>
</ul>

<h2>4. Cookies</h2>
<p>We use cookies and similar tracking technologies to enhance your experience. You can instruct your browser to refuse all cookies. However, if you do not accept cookies, some portions of our website may not function properly.</p>
<ul>
<li><strong>Strictly Necessary Cookies</strong> — Required for the website to function</li>
<li><strong>Analytics Cookies</strong> — Help us understand how visitors interact with our site</li>
<li><strong>Marketing Cookies</strong> — Used to deliver relevant advertisements</li>
</ul>

<h2>5. Third-Party Services</h2>
<p>We may share your information with service providers who assist us in operating our website, if required by law, or to protect our rights. We do not sell your personal data to third parties.</p>

<h2>6. Data Retention</h2>
<p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law.</p>

<h2>7. Your Rights</h2>
<p>Depending on your location, you may have the right to access, correct, request deletion, and withdraw consent regarding your personal data. Contact privacy@tradingtoolkits.com.</p>

<h2>8. Children's Privacy</h2>
<p>Our website is not directed at children under 18. We do not knowingly collect personal information from minors.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page.</p>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  disclaimer: {
    title: 'Disclaimer',
    content: `<p style="opacity:0.7;font-style:italic;margin-bottom:1rem;">Last Updated: June 2025</p>
<h1>Disclaimer</h1>

<h2>General Information Only</h2>
<p>The content available on Trading Toolkits — including all tools, calculators, articles, analyses, guides, and data — is provided for <strong>general informational and educational purposes only</strong>. Nothing on this website constitutes financial advice, investment advice, trading recommendations, or any form of professional counsel.</p>

<h2>No Financial Advice</h2>
<p>Trading Toolkits is not a licensed financial advisor, broker, investment firm, or regulated financial entity. The tools and information provided are intended to assist users in their own independent research and decision-making process.</p>

<h2>Trading Risks</h2>
<p>Trading in financial markets — including binary options, forex, and cryptocurrencies — involves <strong>substantial risk of loss</strong> and is not suitable for every investor. You could lose some or all of your invested capital. Past performance is not indicative of future results.</p>

<h2>Sports Betting Risks</h2>
<p>Sports betting involves financial risk and may not be legal in your jurisdiction. Our Sports Betting Toolkit is intended for informational and analytical purposes only. We do not encourage or facilitate illegal gambling.</p>

<h2>Accuracy of Information</h2>
<p>While we strive to keep our tools accurate and up to date, we make no representations or warranties of any kind, express or implied, regarding the completeness, accuracy, reliability, or suitability of the information and tools provided. Any reliance you place on such information is strictly at your own risk.</p>

<h2>Third-Party Links</h2>
<p>Our website may contain links to external websites. We have no control over the content or practices of those sites and assume no responsibility for them.</p>

<h2>Limitation of Liability</h2>
<p>To the fullest extent permitted by applicable law, Trading Toolkits and its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use this website or its tools.</p>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  terms: {
    title: 'Terms of Service',
    content: `<p style="opacity:0.7;font-style:italic;margin-bottom:1rem;">Last Updated: June 2025</p>
<h1>Terms of Service</h1>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using Trading Toolkits (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must discontinue use immediately.</p>

<h2>2. Eligibility</h2>
<p>You must be at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction) to use this Website.</p>

<h2>3. Description of Services</h2>
<p>Trading Toolkits provides online tools and educational resources across Binary Option, Crypto Trading, Forex Trading, and Sports Betting Toolkits. These tools are provided as-is for informational purposes. We reserve the right to modify or discontinue any tool or feature at any time without notice.</p>

<h2>4. User Conduct</h2>
<p>When using our Website, you agree NOT to:</p>
<ul>
<li>Use the tools for any unlawful or prohibited purpose</li>
<li>Attempt to gain unauthorized access to any part of the Website</li>
<li>Reproduce, duplicate, or exploit any portion without our written permission</li>
<li>Upload or transmit viruses or malicious code</li>
<li>Engage in scraping, data mining, or automated access without authorization</li>
<li>Impersonate any person or entity</li>
</ul>

<h2>5. Intellectual Property</h2>
<p>All content on Trading Toolkits — including text, graphics, tool designs, logos, and software — is the intellectual property of Trading Toolkits and is protected by copyright, trademark, and other IP laws.</p>

<h2>6. Third-Party Services and Links</h2>
<p>Our Website may link to or integrate with third-party platforms. We do not endorse and are not responsible for their content, policies, or practices.</p>

<h2>7. No Financial Services</h2>
<p>Nothing on this Website constitutes financial services, investment advice, or solicitation to trade. We are not a regulated entity.</p>

<h2>8. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Trading Toolkits shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the Website.</p>

<h2>9. Indemnification</h2>
<p>You agree to indemnify and hold harmless Trading Toolkits from and against any claims, damages, losses, or expenses arising from your use of the Website or your violation of these Terms.</p>

<h2>10. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with applicable laws.</p>

<h2>11. Changes to Terms</h2>
<p>We reserve the right to update these Terms at any time. Continued use constitutes acceptance of revised Terms.</p>

<h2>12. Contact</h2>
<p>For questions, contact legal@tradingtoolkits.com.</p>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  dmca: {
    title: 'DMCA Policy',
    content: `<p style="opacity:0.7;font-style:italic;margin-bottom:1rem;">Last Updated: June 2025</p>
<h1>DMCA Policy</h1>

<h2>Digital Millennium Copyright Act Notice</h2>
<p>Trading Toolkits respects the intellectual property rights of others and expects its users to do the same. In accordance with the DMCA of 1998, we will respond promptly to claims of copyright infringement committed using our Website.</p>

<h2>Filing a DMCA Takedown Notice</h2>
<p>If you believe that material on our Website infringes your copyright, please send a written notice to our DMCA agent containing:</p>
<ol>
<li><strong>Identification of the copyrighted work</strong> you claim has been infringed.</li>
<li><strong>Identification of the infringing material</strong> — provide the URL or specific location.</li>
<li><strong>Your contact information</strong>, including full name, mailing address, telephone number, and email.</li>
<li><strong>A good faith belief statement</strong> that use is unauthorized.</li>
<li><strong>Accuracy statement</strong> under penalty of perjury that you are authorized to act.</li>
<li><strong>Your physical or electronic signature.</strong></li>
</ol>

<h2>DMCA Agent Contact</h2>
<p><strong>Email:</strong> dmca@tradingtoolkits.com<br><strong>Subject Line:</strong> DMCA Takedown Notice</p>
<p>We will review and respond within <strong>5 to 10 business days</strong>.</p>

<h2>Counter-Notification</h2>
<p>If you believe content was removed in error, you may submit a counter-notification including your contact information, identification of removed material, a statement under penalty of perjury that removal was a mistake, and consent to jurisdiction.</p>

<h2>Repeat Infringers</h2>
<p>Trading Toolkits reserves the right to terminate the access of users who are repeat copyright infringers.</p>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
  sitemap: {
    title: 'Sitemap',
    content: `<h1>Sitemap</h1>

<h2>Main Pages</h2>
<ul>
<li>Home</li>
<li>About Us</li>
<li>Contact Us</li>
<li>Privacy Policy</li>
<li>Disclaimer</li>
<li>Terms of Service</li>
<li>DMCA Policy</li>
<li>Sitemap</li>
</ul>

<h2>Toolkits — Binary Option Toolkit</h2>
<ul>
<li>Overview</li>
<li>AI Signal Tool</li>
<li>ChatGPT Signal Generator</li>
<li>AI Chart Scanner</li>
<li>Advanced Martingale Calculator</li>
<li>Risk Calculator</li>
<li>Win Rate Calculator</li>
<li>Payout Calculator</li>
</ul>

<h2>Toolkits — Crypto Trading Toolkit</h2>
<ul>
<li>Overview</li>
<li>Profit Calculator</li>
<li>Position Size Calculator</li>
<li>PnL Calculator</li>
<li>ROI Calculator</li>
<li>DCA Calculator</li>
<li>Leverage Calculator</li>
<li>Liquidation Calculator</li>
<li>Break Even Calculator</li>
<li>Compound Interest Calculator</li>
<li>Staking Rewards Calculator</li>
<li>Risk Of Ruin Calculator</li>
<li>Arbitrage Scanner</li>
<li>RSI Scanner</li>
<li>MACD Scanner</li>
<li>Support Resistance Scanner</li>
<li>Trend Scanner</li>
<li>Breakout Scanner</li>
<li>Funding Rate Scanner</li>
<li>Volatility Scanner</li>
<li>Moving Average Scanner</li>
<li>Volume Surge Scanner</li>
</ul>

<h2>Toolkits — Forex Trading Toolkit</h2>
<ul>
<li>Overview</li>
<li>Position Size Calculator</li>
<li>Risk Reward Calculator</li>
<li>Drawdown Recovery Calculator</li>
<li>Essential Compounding Calculator</li>
<li>Market Sessions Tool</li>
<li>Live Trade Journal</li>
<li>Prop Firm Target Calculator</li>
<li>Prop Firm Simulator</li>
</ul>

<h2>Toolkits — Sports Betting Toolkit</h2>
<ul>
<li>Overview</li>
<li>Odds Converter</li>
<li>Implied Probability</li>
<li>Draw No Bet Calculator</li>
<li>Value Bet Finder</li>
<li>EV Simulator</li>
<li>Staking Calculator</li>
<li>Kelly Criterion</li>
<li>Stake Calculator</li>
<li>Unit Size Calculator</li>
<li>Risk Strategy Tool</li>
<li>Risk Of Ruin Calculator</li>
<li>Arbitrage Calculator</li>
<li>Hedge Calculator</li>
<li>Dutching Calculator</li>
<li>Combination Calculator</li>
<li>Parlay Calculator</li>
<li>Round Robin Calculator</li>
<li>Martingale Calculator</li>
<li>Fibonacci Calculator</li>
<li>Streak Simulator</li>
<li>Tracking Tool</li>
<li>Bankroll Tracker</li>
<li>ROI Calculator</li>
<li>Yield Calculator</li>
</ul>

<h2>Resources & Support</h2>
<ul>
<li>Getting Started Guide</li>
<li>FAQs</li>
<li>Glossary (Trading & Betting Terms)</li>
<li>Blog / Tips & Analysis</li>
<li>Tool Update Changelog</li>
</ul>
<p style="text-align:center;margin-top:2rem;"><em>© 2025 Trading Toolkits. All Rights Reserved.</em></p>`,
  },
};

export default function LegalPages({ page, onBack }: LegalPagesProps) {
  const pageData = pages[page];
  if (!pageData) return null;

  return (
    <main className="page-transition px-4 py-8">
      <div className="site-shell">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="gold-border-card p-6 md:p-10">
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </div>
      </div>
    </main>
  );
}
