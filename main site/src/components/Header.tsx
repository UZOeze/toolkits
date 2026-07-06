interface HeaderProps {
  onHome: () => void;
}

export default function Header({ onHome }: HeaderProps) {
  return (
    <header className="relative px-4 pb-6 pt-10 md:pb-8 md:pt-14">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

      <div className="site-shell text-center">
        {/* Logo */}
        <div className="mb-5">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onHome(); }}
            className="inline-block transition-transform duration-500 hover:scale-110"
          >
            <div className="animate-float">
              <img
                src="https://i.postimg.cc/J7Q25J5Y/new-logo.png"
                alt="My Toolkits - Professional Trading & Betting Toolkits"
                className="mx-auto h-28 w-28 rounded-xl object-contain gold-glow md:h-36 md:w-36"
                loading="lazy"
              />
            </div>
          </a>
        </div>

        <h1 className="stylish-brand mb-3 text-4xl font-black tracking-[0.18em] md:text-5xl lg:text-6xl">
          MY TOOLKITS
        </h1>

        <div className="inline-block max-w-full rounded-xl border border-yellow-500/50 bg-black/50 px-6 py-2.5 backdrop-blur-sm">
          <p className="text-base font-medium italic text-yellow-300 md:text-xl">
            Professional Trading & Betting Toolkits Powered By CryptoRocket
          </p>
        </div>
      </div>
    </header>
  );
}
