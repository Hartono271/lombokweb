"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SectionNavItem {
  id: string;
  label: string;
  icon: string;
}

interface HeaderProps {
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  activePage: 'home' | 'destinations' | 'feedback';
  onNavigate?: (screen: 'welcome' | 'search') => void;
  topBarItems?: { key: string; label: string; active?: boolean; onClick?: () => void }[];
  sectionNavItems?: SectionNavItem[];
}

export default function Header({ lang, setLang, activePage, onNavigate, topBarItems, sectionNavItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const scrollToSection = (id: string) => {
    closeMobile();
    if (onNavigate) onNavigate('welcome');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 120;
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* ===== Top Bar ===== */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <nav className="top-bar-nav">
            {topBarItems && topBarItems.map((item) => (
              <a
                key={item.key}
                onClick={item.onClick}
                className={item.active ? 'active' : ''}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ===== Header ===== */}
      <header className="site-header">
        <div className="header-inner">
          {onNavigate ? (
            <div className="header-logo" onClick={() => { onNavigate('welcome'); closeMobile(); }}>
              <span className="logo-icon"><i className="fas fa-umbrella-beach"></i></span>
              <div className="logo-text">
                <span className="logo-main">Lombok</span>
                <span className="logo-sub">Tourism</span>
              </div>
            </div>
          ) : (
            <Link href="/" className="header-logo" onClick={closeMobile}>
              <span className="logo-icon"><i className="fas fa-umbrella-beach"></i></span>
              <div className="logo-text">
                <span className="logo-main">Lombok</span>
                <span className="logo-sub">Tourism</span>
              </div>
            </Link>
          )}

          <nav className="main-nav">
            {onNavigate ? (
              <>
                <a
                  className={activePage === 'home' ? 'active' : ''}
                  onClick={() => onNavigate('welcome')}
                >
                  {lang === 'id' ? 'BERANDA' : 'HOME'}
                </a>
                {sectionNavItems && sectionNavItems.length > 0 && (
                  <div className="nav-dropdown">
                    <a className="nav-dropdown-trigger">
                      {lang === 'id' ? 'TENTANG' : 'ABOUT'}{' '}
                      <i className="fas fa-chevron-down" style={{ fontSize: '0.65rem', marginLeft: 4 }}></i>
                    </a>
                    <div className="nav-dropdown-menu">
                      {sectionNavItems.map((item) => (
                        <a key={item.id} onClick={() => scrollToSection(item.id)}>
                          <i className={item.icon}></i> {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <a
                  className={activePage === 'destinations' ? 'active' : ''}
                  onClick={() => onNavigate('search')}
                >
                  {lang === 'id' ? 'DESTINASI' : 'DESTINATIONS'}{' '}
                  <i className="fas fa-chevron-down" style={{ fontSize: '0.65rem', marginLeft: 4 }}></i>
                </a>
              </>
            ) : (
              <>
                <Link href="/" className={activePage === 'home' ? 'active' : ''}>
                  {lang === 'id' ? 'BERANDA' : 'HOME'}
                </Link>
                <Link href="/" className={activePage === 'destinations' ? 'active' : ''}>
                  {lang === 'id' ? 'DESTINASI' : 'DESTINATIONS'}
                </Link>
              </>
            )}
            <Link href="/feedback" className={activePage === 'feedback' ? 'active' : ''}>
              FEEDBACK
            </Link>
          </nav>

          <div className="header-actions">
            {onNavigate && (
              <button className="header-search-btn" onClick={() => onNavigate('search')}>
                <i className="fas fa-search"></i>
              </button>
            )}
            <button className="lang-toggle" onClick={() => setLang(lang === 'id' ? 'en' : 'id')}>
              {lang === 'id' ? 'IN ENGLISH' : 'INDONESIA'}
            </button>
            <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              <i className={mobileOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Mobile Navigation Drawer ===== */}
      <div className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`} onClick={closeMobile} />
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="logo-icon"><i className="fas fa-umbrella-beach"></i></span>
          <div className="logo-text">
            <span className="logo-main">Lombok</span>
            <span className="logo-sub">Tourism</span>
          </div>
          <button className="mobile-nav-close" onClick={closeMobile}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mobile-nav-links">
          {onNavigate ? (
            <>
              <a
                className={`mobile-nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => { onNavigate('welcome'); closeMobile(); }}
              >
                <i className="fas fa-home"></i>
                {lang === 'id' ? 'Beranda' : 'Home'}
              </a>
              <a
                className={`mobile-nav-link ${activePage === 'destinations' ? 'active' : ''}`}
                onClick={() => { onNavigate('search'); closeMobile(); }}
              >
                <i className="fas fa-map-marker-alt"></i>
                {lang === 'id' ? 'Destinasi' : 'Destinations'}
              </a>
            </>
          ) : (
            <>
              <Link href="/" className={`mobile-nav-link ${activePage === 'home' ? 'active' : ''}`} onClick={closeMobile}>
                <i className="fas fa-home"></i>
                {lang === 'id' ? 'Beranda' : 'Home'}
              </Link>
              <Link href="/" className={`mobile-nav-link ${activePage === 'destinations' ? 'active' : ''}`} onClick={closeMobile}>
                <i className="fas fa-map-marker-alt"></i>
                {lang === 'id' ? 'Destinasi' : 'Destinations'}
              </Link>
            </>
          )}
          <Link href="/feedback" className={`mobile-nav-link ${activePage === 'feedback' ? 'active' : ''}`} onClick={closeMobile}>
            <i className="fas fa-comment-dots"></i>
            Feedback
          </Link>
        </div>

        {sectionNavItems && sectionNavItems.length > 0 && (
          <div className="mobile-nav-categories">
            <div className="mobile-nav-section-title">
              {lang === 'id' ? 'Navigasi Halaman' : 'Page Navigation'}
            </div>
            <div className="mobile-nav-cat-grid">
              {sectionNavItems.map((item) => (
                <a
                  key={item.id}
                  className="mobile-nav-cat"
                  onClick={() => scrollToSection(item.id)}
                >
                  <i className={item.icon} style={{ marginRight: 6 }}></i>{item.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {topBarItems && topBarItems.length > 0 && (
          <div className="mobile-nav-categories">
            <div className="mobile-nav-section-title">
              {lang === 'id' ? 'Kategori' : 'Categories'}
            </div>
            <div className="mobile-nav-cat-grid">
              {topBarItems.map((item) => (
                <a
                  key={item.key}
                  className={`mobile-nav-cat ${item.active ? 'active' : ''}`}
                  onClick={() => { item.onClick?.(); closeMobile(); }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mobile-nav-footer">
          <button className="mobile-lang-btn" onClick={() => { setLang(lang === 'id' ? 'en' : 'id'); closeMobile(); }}>
            {lang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
          </button>
        </div>
      </nav>
    </>
  );
}
