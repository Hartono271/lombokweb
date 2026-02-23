"use client";

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  lang: 'id' | 'en';
  onNavigate?: (screen: 'welcome' | 'search') => void;
}

export default function Footer({ lang, onNavigate }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-logo"><i className="fas fa-umbrella-beach" style={{ marginRight: 8 }}></i>Lombok Paradise</div>
        <p>
          {lang === 'id'
            ? '© 2026 Lombok Tourism — Mesin Pencari Wisata Berbasis Web Semantik'
            : '© 2026 Lombok Tourism — Semantic Web Tourism Search Engine'}
        </p>
        <div className="footer-links">
          {onNavigate ? (
            <>
              <a onClick={() => onNavigate('welcome')} style={{ cursor: 'pointer' }}>
                {lang === 'id' ? 'Beranda' : 'Home'}
              </a>
              <a onClick={() => onNavigate('search')} style={{ cursor: 'pointer' }}>
                {lang === 'id' ? 'Destinasi' : 'Destinations'}
              </a>
            </>
          ) : (
            <>
              <Link href="/">{lang === 'id' ? 'Beranda' : 'Home'}</Link>
              <Link href="/">{lang === 'id' ? 'Destinasi' : 'Destinations'}</Link>
            </>
          )}
          <Link href="/feedback">Feedback</Link>
        </div>
      </div>
    </footer>
  );
}
