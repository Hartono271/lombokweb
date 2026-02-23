"use client";

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  activePage: 'home' | 'destinations' | 'feedback';
  onNavigate?: (screen: 'welcome' | 'search') => void;
  topBarItems?: { key: string; label: string; active?: boolean; onClick?: () => void }[];
}

export default function Header({ lang, setLang, activePage, onNavigate, topBarItems }: HeaderProps) {
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
            <div className="header-logo" onClick={() => onNavigate('welcome')}>
              <span className="logo-icon">🏝️</span>
              <div className="logo-text">
                <span className="logo-main">Lombok</span>
                <span className="logo-sub">Tourism</span>
              </div>
            </div>
          ) : (
            <Link href="/" className="header-logo">
              <span className="logo-icon">🏝️</span>
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
              {lang === 'id' ? '🇬🇧 IN ENGLISH' : '🇮🇩 INDONESIA'}
            </button>
            <button className="menu-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
