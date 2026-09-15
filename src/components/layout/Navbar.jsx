import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, FileText, ArrowRight, GitCompare, History, Menu, X, Sparkles, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const navLinksLanding = [
    { label: 'Features', href: '/#features', icon: Sparkles },
    { label: 'How It Works', href: '/#how-it-works', icon: FileText },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'History', href: '/history', icon: History }
  ];

  const navLinksApp = [
    { label: 'Analyzer', href: '/analyzer', icon: FileText },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'History', href: '/history', icon: History }
  ];

  const currentNavLinks = isLanding ? navLinksLanding : navLinksApp;

  const handleAnchorClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo -> returns to / */}
        <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.01]">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:bg-blue-600 transition-colors duration-300">
            <Scale className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              LexiLaw <span className="text-blue-600">AI</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">Legal Assistant</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
          {currentNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return link.href.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all duration-150"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="hidden md:flex items-center gap-3">
          {isLanding ? (
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-blue-600 transition-all duration-200 shadow-sm shadow-slate-900/10 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              Analyze Document
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all duration-200 shadow-sm shadow-blue-600/20 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              New Analysis
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <div className="flex flex-col space-y-1">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return link.href.startsWith('/#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/analyzer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-base hover:bg-blue-600 transition-colors shadow-sm"
            >
              {isLanding ? 'Analyze Document' : 'New Analysis'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
