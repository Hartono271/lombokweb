"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dictionary } from '../dictionary';
import Carousel from './Carousel';
import Header from './Header';
import Footer from './Footer';
import { getCategories } from '../lib/categories';

// SWRL Rules untuk smart search
const swrlRules: any = {
  holiday: { keywords: ['liburan', 'holiday', 'summer', 'vacation', 'libur', 'rekreasi'], types: ['Marine', 'Island', 'Park', 'Natural'], badge: '✨ Holiday Choice', badgeId: '✨ Pilihan Liburan' },
  budget: { keywords: ['murah', 'cheap', 'budget', 'hemat', 'gratis', 'free', 'affordable', 'terjangkau'], priceFilter: 'cheap', badge: '💰 Budget Friendly', badgeId: '💰 Hemat Budget' },
  expensive: { keywords: ['mahal', 'expensive', 'premium', 'luxury', 'mewah', 'eksklusif'], priceFilter: 'expensive', badge: '💎 Premium', badgeId: '💎 Wisata Premium' },
  family: { keywords: ['keluarga', 'family', 'kids', 'anak', 'children'], types: ['Park', 'Waterfall', 'Bathing', 'Island'], badge: '👨‍👩‍👧‍👦 Family Friendly', badgeId: '👨‍👩‍👧‍👦 Ramah Keluarga' },
  adventure: { keywords: ['petualangan', 'adventure', 'hiking', 'trekking', 'pendakian', 'extreme'], types: ['Mountain', 'Cave', 'Natural', 'Forrest'], badge: '🧗 Adventure Spot', badgeId: '🧗 Spot Petualangan' },
  culture: { keywords: ['budaya', 'culture', 'tradisi', 'sasak', 'adat', 'traditional'], types: ['Cultural', 'Village', 'Educational'], badge: '🏛️ Cultural Heritage', badgeId: '🏛️ Warisan Budaya' },
  religious: { keywords: ['religi', 'religious', 'spiritual', 'ibadah', 'temple', 'mosque', 'masjid', 'pura', 'ziarah'], types: ['Religious', 'Cultural'], badge: '🕌 Religious Tourism', badgeId: '🕌 Wisata Religi' },
  nature: { keywords: ['alam', 'nature', 'eco', 'green', 'hijau', 'forest', 'hutan', 'natural'], types: ['Natural', 'Forrest', 'Eco', 'Park', 'Waterfall', 'Mountain', 'Lake'], badge: '🌿 Nature Escape', badgeId: '🌿 Wisata Alam' },
  education: { keywords: ['edukasi', 'education', 'belajar', 'learn', 'museum', 'sejarah', 'history', 'pengetahuan'], types: ['Educational', 'Cultural', 'Agrotourism'], badge: '📚 Educational', badgeId: '📚 Wisata Edukasi' },
  popular: { keywords: ['populer', 'popular', 'terkenal', 'famous', 'top', 'terbaik', 'best', 'trending'], ratingFilter: 'high', badge: '⭐ Popular', badgeId: '⭐ Populer' },
  unpopular: { keywords: ['hidden', 'tersembunyi', 'rahasia', 'secret', 'sepi', 'quiet', 'underrated'], ratingFilter: 'low', badge: '🔍 Hidden Gem', badgeId: '🔍 Permata Tersembunyi' },
  relax: { keywords: ['relax', 'santai', 'spa', 'wellness', 'healing', 'pemandian', 'istirahat'], types: ['Bathing', 'Park', 'Island'], badge: '🧘 Relaxation', badgeId: '🧘 Relaksasi' },
  photo: { keywords: ['foto', 'photo', 'instagram', 'scenic', 'view', 'pemandangan', 'sunset'], types: ['Marine', 'Mountain', 'Island', 'Valley', 'Savana', 'Waterfall'], badge: '📸 Instagrammable', badgeId: '📸 Spot Foto' },
  water: { keywords: ['air', 'water', 'swim', 'berenang', 'snorkeling', 'diving', 'surfing', 'laut'], types: ['Marine', 'Island', 'Waterfall', 'Bathing', 'Lake'], badge: '🌊 Water Activities', badgeId: '🌊 Wisata Air' },
  food: { keywords: ['makanan', 'food', 'kuliner', 'culinary', 'makan', 'eat', 'restaurant', 'kopi'], types: ['Culinary'], badge: '🍜 Culinary Tour', badgeId: '🍜 Wisata Kuliner' },
  events: { keywords: ['event', 'acara', 'festival', 'perayaan', 'celebration', 'ceremony'], types: ['Events'], badge: '🎉 Events', badgeId: '🎉 Acara' }
};

// Terjemahan transportasi
const transportTranslations: any = {
  'Car': { id: 'Mobil', en: 'Car' },
  'Motorcycle': { id: 'Motor', en: 'Motorcycle' },
  'Bus': { id: 'Bus', en: 'Bus' },
  'Taxi': { id: 'Taksi', en: 'Taxi' },
  'Boat': { id: 'Perahu', en: 'Boat' },
  'Ferry': { id: 'Kapal Feri', en: 'Ferry' },
  'Speedboat': { id: 'Speedboat', en: 'Speedboat' },
  'Plane': { id: 'Pesawat', en: 'Plane' },
  'PublicTransport': { id: 'Angkutan Umum', en: 'Public Transport' },
  'PrivateVehicle': { id: 'Kendaraan Pribadi', en: 'Private Vehicle' }
};

// Reason icons
const reasonIcons = ['🏝️', '⛰️', '🎭', '🏄', '🌴', '🏘️', '💧', '🍜'];

export default function ClientView({ initialData }: { initialData: any[] }) {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [screen, setScreen] = useState<'welcome' | 'search'>('welcome');
  const [keyword, setKeyword] = useState('');
  const [locFilter, setLocFilter] = useState('all');
  const [transFilter, setTransFilter] = useState('all');
  const [activeCategories, setActiveCategories] = useState<string[]>(['all']);
  const [modalItem, setModalItem] = useState<any>(null);

  const t = dictionary[lang];

  // Carousel images
  const carouselImages = [
    '/01.png',
    '/02.png',
    '/03.png',
    '/04.png',
    '/05.png'
  ];

  // ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalItem(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Helper: get image url
  const getImageUrl = (item: any) => {
    return item.img && item.img.startsWith('http') ? item.img : 'https://placehold.co/400x300/B8860B/white?text=Lombok';
  };

  // Featured items for welcome page
  const featuredItems = useMemo(() => {
    return initialData
      .filter(item => item.img && item.img.startsWith('http'))
      .slice(0, 7);
  }, [initialData]);

  // Video item for hero
  const videoItem = useMemo(() => {
    return initialData.find(item => item.video && item.video.includes('youtube'));
  }, [initialData]);

  // Helper functions
  const translateTransport = (transport: string) => {
    if (!transport) return lang === 'id' ? 'Kendaraan Pribadi' : 'Private Vehicle';
    let translated = transport;
    Object.keys(transportTranslations).forEach(key => {
      const regex = new RegExp(key, 'gi');
      translated = translated.replace(regex, transportTranslations[key][lang]);
    });
    return translated;
  };

  const formatPrice = (price: string) => {
    if (!price || price === '') return t.free;
    if (price.includes(' - ') || price.includes('–') || price.includes('/') ||
      price.includes('weekday') || price.includes('weekend') ||
      price.includes('domestic') || price.includes('foreign') ||
      price.includes('wisatawan') || price.includes('tiket') ||
      price.includes('sewa') || price.includes('rental') ||
      price.length > 50) {
      return price;
    }
    const priceMatch = price.match(/^[\d.,]+$/);
    if (priceMatch) {
      const priceStr = price.replace(/\./g, '').replace(/,/g, '');
      const priceNum = parseInt(priceStr);
      if (priceNum && priceNum < 10000000) {
        return 'Rp ' + priceNum.toLocaleString('id-ID');
      }
    }
    if (price.toLowerCase().includes('free') || price === '0' || price.toLowerCase().includes('gratis')) {
      return t.free;
    }
    return price;
  };

  const extractVideoId = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  };

  // Filtering Logic
  const filteredData = useMemo(() => {
    let filtered = initialData;

    let activeRules: any[] = [];
    for (const [ruleName, rule] of Object.entries(swrlRules)) {
      const ruleObj = rule as { keywords: string[]; badge: string; badgeId: string; filter: (item: any, lang: string) => boolean };
      if (ruleObj.keywords.some((kw: string) => keyword.toLowerCase().includes(kw))) {
        activeRules.push({ name: ruleName, ...ruleObj });
      }
    }
    const isSmartSearchActive = activeRules.length > 0;

    filtered = filtered.filter((item) => {
      const itemData = {
        title: lang === 'id' ? item.nameId : item.nameEn,
        typeLabel: lang === 'id' ? item.typeLabelId : item.typeLabelEn,
        desc: lang === 'id' ? item.descId : item.descEn,
        activity: lang === 'id' ? item.activityId : item.activityEn,
        facility: lang === 'id' ? item.facilityId : item.facilityEn,
        price: lang === 'id' ? item.priceId : item.priceEn,
        openingHours: lang === 'id' ? item.openingHoursId : item.openingHoursEn,
        location: lang === 'id' ? item.locationId : item.locationEn,
      };

      let passCategory = activeCategories.includes('all') ? true :
        activeCategories.some(cat => item.typeURI.includes(cat));

      let passLocation = (locFilter === 'all') ? true : (item.locationURI || '').includes(locFilter);

      let passTransport = (transFilter === 'all') ? true : item.transport.toLowerCase().includes(transFilter.toLowerCase());

      let passKeyword = true;
      if (!isSmartSearchActive && keyword !== "") {
        passKeyword = itemData.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.nameEn.toLowerCase().includes(keyword.toLowerCase()) ||
          item.nameId.toLowerCase().includes(keyword.toLowerCase()) ||
          itemData.desc.toLowerCase().includes(keyword.toLowerCase());
      }

      let passSmartRule = true;
      if (isSmartSearchActive) {
        passSmartRule = false;
        for (const rule of activeRules) {
          if (rule.types && rule.types.some((t: string) => item.typeURI.includes(t))) {
            passSmartRule = true;
            break;
          }
          if (rule.priceFilter === 'cheap') {
            let priceVal = parseInt(itemData.price.replace(/[^0-9]/g, '')) || 0;
            if (itemData.price.toLowerCase().includes('free') || itemData.price.toLowerCase().includes('gratis') || priceVal < 50000 || itemData.price === '') {
              passSmartRule = true;
              break;
            }
          }
          if (rule.priceFilter === 'expensive') {
            let priceVal = parseInt(itemData.price.replace(/[^0-9]/g, '')) || 0;
            if (priceVal >= 50000) {
              passSmartRule = true;
              break;
            }
          }
          if (rule.ratingFilter === 'high') {
            let ratingVal = parseFloat(item.rating) || 0;
            if (ratingVal >= 4.5) {
              passSmartRule = true;
              break;
            }
          }
          if (rule.ratingFilter === 'low') {
            let ratingVal = parseFloat(item.rating) || 0;
            if (ratingVal > 0 && ratingVal < 4.5) {
              passSmartRule = true;
              break;
            }
          }
        }
      }

      return passCategory && passLocation && passTransport && passKeyword && passSmartRule;
    });

    return { filtered, activeRules };
  }, [initialData, keyword, locFilter, transFilter, activeCategories, lang]);

  const setCategory = (cat: string) => {
    if (cat === 'all') {
      setActiveCategories(['all']);
    } else {
      let newCategories = activeCategories.filter(c => c !== 'all');
      if (newCategories.includes(cat)) {
        newCategories = newCategories.filter(c => c !== cat);
        if (newCategories.length === 0) {
          newCategories = ['all'];
        }
      } else {
        newCategories.push(cat);
      }
      setActiveCategories(newCategories);
    }
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Filtering is automatic
    }
  };

  // Category definitions for top bar and pills
  const categories = getCategories(lang);

  return (
    <div className="site-wrapper">
      <Header
        lang={lang}
        setLang={setLang}
        activePage={screen === 'welcome' ? 'home' : 'destinations'}
        onNavigate={setScreen}
        topBarItems={categories.slice(1).map((cat) => ({
          key: cat.key,
          label: cat.label.toUpperCase(),
          active: activeCategories.includes(cat.key),
          onClick: () => { setCategory(cat.key); setScreen('search'); },
        }))}
      />

      {/* ===== Main Content ===== */}
      <main>
        {screen === 'welcome' ? (
          <>
            {/* ===== Hero Section ===== */}
            <section className="hero-section">
              <div className="hero-bg">
                <Carousel images={carouselImages} />
              </div>
              <div className="hero-overlay">
                <div className="hero-left">
                  <p className="hero-label">
                    {lang === 'id' ? 'Selamat datang di Laman Resmi' : 'Welcome to the Official Page'}
                  </p>
                  <h1 className="hero-title">
                    <span className="hero-title-line">
                      <span className="hero-title-highlight">Lombok</span>
                    </span>
                    <span className="hero-title-line">
                      <span className="hero-title-highlight">Paradise</span>
                    </span>
                  </h1>
                  <div className="hero-actions">
                    <button className="hero-btn" onClick={() => setScreen('search')}>
                      <i className="fas fa-compass"></i> {t.startBtn.toUpperCase()}
                    </button>
                    {videoItem && (
                      <button className="hero-btn hero-btn-outline" onClick={() => setModalItem(videoItem)}>
                        <i className="fab fa-youtube"></i> {lang === 'id' ? 'VIDEO WISATA' : 'TOURISM VIDEO'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="hero-right">
                  {/* Video Card */}
                  <div
                    className="hero-card hero-video-card"
                    onClick={() => videoItem && setModalItem(videoItem)}
                  >
                    <div className="hero-card-img">
                      <Image
                        src="/01.png"
                        alt="Lombok Video"
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="300px"
                      />
                      <div className="hero-card-play">
                        <i className="fas fa-play-circle"></i>
                      </div>
                    </div>
                    <div className="hero-card-label">
                      <span>{lang === 'id' ? 'Video Resmi' : 'Official Video'}</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>

                  {/* Info Card */}
                  {featuredItems[0] && (
                    <div
                      className="hero-card hero-info-card"
                      onClick={() => setModalItem(featuredItems[0])}
                    >
                      <p className="hero-card-text">
                        {lang === 'id' ? featuredItems[0].nameId : featuredItems[0].nameEn}
                      </p>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ===== Featured Destinations ===== */}
            {featuredItems.length >= 3 && (
              <section className="featured-section">
                <div className="section-inner">
                  <div className="featured-grid">
                    {/* Main Featured Card */}
                    <div className="featured-main" onClick={() => setModalItem(featuredItems[0])}>
                      <Image
                        src={getImageUrl(featuredItems[0])}
                        alt={lang === 'id' ? featuredItems[0].nameId : featuredItems[0].nameEn}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">
                          <span className="badge-dot"></span>
                          {lang === 'id' ? 'Destinasi Unggulan' : 'Featured Destination'}
                        </span>
                        <h3>{lang === 'id' ? featuredItems[0].nameId : featuredItems[0].nameEn}</h3>
                        <span className="featured-type">
                          {lang === 'id' ? featuredItems[0].typeLabelId : featuredItems[0].typeLabelEn}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Cards */}
                    {featuredItems.slice(1, 3).map((item: any, i: number) => (
                      <div key={i} className="featured-secondary" onClick={() => setModalItem(item)}>
                        <div className="featured-sec-img">
                          <Image
                            src={getImageUrl(item)}
                            alt={lang === 'id' ? item.nameId : item.nameEn}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="featured-sec-body">
                          <span className="featured-sec-type">
                            {lang === 'id' ? item.typeLabelId : item.typeLabelEn}
                          </span>
                          <h4>{lang === 'id' ? item.nameId : item.nameEn}</h4>
                        </div>
                      </div>
                    ))}

                    {featuredItems.slice(3, 5).map((item: any, i: number) => (
                      <div key={i + 2} className="featured-secondary" onClick={() => setModalItem(item)}>
                        <div className="featured-sec-img">
                          <Image
                            src={getImageUrl(item)}
                            alt={lang === 'id' ? item.nameId : item.nameEn}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="featured-sec-body">
                          <span className="featured-sec-type">
                            {lang === 'id' ? item.typeLabelId : item.typeLabelEn}
                          </span>
                          <h4>{lang === 'id' ? item.nameId : item.nameEn}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ===== More Destinations Row ===== */}
            {featuredItems.length >= 5 && (
              <section className="more-section">
                <div className="section-inner">
                  <div className="more-grid">
                    {featuredItems.slice(3, 7).map((item: any, i: number) => (
                      <div key={i} className="more-card" onClick={() => setModalItem(item)}>
                        <div className="more-card-img">
                          <Image
                            src={getImageUrl(item)}
                            alt={lang === 'id' ? item.nameId : item.nameEn}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        </div>
                        <h5>{lang === 'id' ? item.nameId : item.nameEn}</h5>
                        <span className="more-card-type">
                          {lang === 'id' ? item.typeLabelId : item.typeLabelEn}
                        </span>
                      </div>
                    ))}
                    <div className="more-see-all" onClick={() => setScreen('search')}>
                      <i className="fas fa-compass"></i>
                      <strong>{lang === 'id' ? 'Lihat Destinasi Lainnya' : 'See More Destinations'}</strong>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ===== Why Lombok Section ===== */}
            <section className="info-section">
              <div className="section-inner">
                <h2>{t.why}</h2>
                <div className="info-grid">
                  {t.reasons.map((reason: string, i: number) => (
                    <div key={i} className="info-item">
                      <span className="info-icon">{reasonIcons[i] || '🌟'}</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ===== Search / Destinations Screen ===== */
          <section className="search-section">
            <div className="section-inner">
              {/* Header */}
              <div className="search-page-header">
                <h2><i className="fas fa-compass"></i> {t.explore}</h2>
                <button className="btn-back" onClick={() => setScreen('welcome')}>
                  <i className="fas fa-arrow-left"></i> {t.backWelcome}
                </button>
              </div>

              {/* Search Bar */}
              <div className="search-bar">
                <div className="search-input-wrap">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyUp={handleEnter}
                    placeholder={t.searchPlace}
                  />
                </div>
              </div>

              {/* SWRL Rules Indicator */}
              {filteredData.activeRules.length > 0 && (
                <div className="swrl-indicator">
                  <i className="fas fa-brain"></i>
                  <span>{t.swrlTitle}</span>
                  <div className="swrl-badges">
                    {filteredData.activeRules.map((rule: any, i: number) => (
                      <span key={i} className="swrl-badge">
                        {lang === 'id' ? rule.badgeId : rule.badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="filters-bar">
                <div className="filter-item">
                  <label><i className="fas fa-map-marker-alt"></i> {t.locLabel}</label>
                  <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)}>
                    <option value="all">{t.allLoc}</option>
                    <option value="Central_Lombok">{t.centralLombok}</option>
                    <option value="EastLombok">{t.eastLombok}</option>
                    <option value="NorthLombok">{t.northLombok}</option>
                    <option value="WestLombok">{t.westLombok}</option>
                    <option value="MataramCity">{t.mataramCity}</option>
                  </select>
                </div>
                <div className="filter-item">
                  <label><i className="fas fa-bus"></i> {t.transLabel}</label>
                  <select value={transFilter} onChange={(e) => setTransFilter(e.target.value)}>
                    <option value="all">{t.allTrans}</option>
                    <option value="Car">{t.car}</option>
                    <option value="motorcyle">{t.motorcycle}</option>
                    <option value="bus">{t.bus}</option>
                    <option value="taxi">{t.taxi}</option>
                    <option value="boat">{t.boat}</option>
                    <option value="ferry">{t.ferry}</option>
                    <option value="speedboat">{t.speedboat}</option>
                    <option value="plane">{t.plane}</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="category-pills">
                {categories.map((cat) => (
                  <div
                    key={cat.key}
                    className={`cat-pill ${activeCategories.includes(cat.key) ? 'active' : ''}`}
                    onClick={() => setCategory(cat.key)}
                  >
                    <i className={cat.icon}></i> {cat.label}
                  </div>
                ))}
              </div>

              {/* Results Header */}
              <div className="results-header">
                <span>
                  {filteredData.filtered.length} {lang === 'id' ? 'destinasi ditemukan' : 'destinations found'}
                </span>
              </div>

              {/* Results Grid */}
              <div className="results-grid">
                {filteredData.filtered.length === 0 ? (
                  <div className="no-results">
                    <i className="fas fa-map-marked-alt"></i>
                    <h3>{t.noResult}</h3>
                  </div>
                ) : (
                  filteredData.filtered.map((item: any, index: number) => {
                    const itemData = {
                      title: lang === 'id' ? item.nameId : item.nameEn,
                      typeLabel: lang === 'id' ? item.typeLabelId : item.typeLabelEn,
                      desc: lang === 'id' ? item.descId : item.descEn,
                      price: lang === 'id' ? item.priceId : item.priceEn,
                      location: lang === 'id' ? item.locationId : item.locationEn,
                    };

                    const imageUrl = getImageUrl(item);

                    let smartBadge = "";
                    let smartClass = "";
                    if (filteredData.activeRules.length > 0) {
                      smartClass = "smart-active";
                      smartBadge = lang === 'id' ? filteredData.activeRules[0].badgeId : filteredData.activeRules[0].badge;
                    }

                    let ratingHtml = '';
                    if (item.rating) {
                      const starCount = Math.round(parseFloat(item.rating));
                      for (let i = 0; i < 5; i++) {
                        ratingHtml += `<i class="fas fa-star" style="color: ${i < starCount ? '#ffd700' : '#ddd'}; font-size: 0.8rem;"></i>`;
                      }
                    }

                    return (
                      <div key={index} className={`dest-card ${smartClass}`}>
                        <div className="dest-card-img">
                          <Image
                            src={imageUrl}
                            alt={itemData.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300/B8860B/white?text=Lombok'}
                          />
                          {smartBadge && (
                            <div className="dest-card-smart-badge">{smartBadge}</div>
                          )}
                        </div>

                        <div className="dest-card-body">
                          <span className="dest-card-tag">{itemData.typeLabel}</span>
                          <h3>{itemData.title}</h3>

                          <div className="dest-card-info">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{itemData.location || 'Lombok'}</span>
                          </div>
                          <div className="dest-card-info">
                            <i className="fas fa-tag"></i>
                            <span>{formatPrice(itemData.price)}</span>
                          </div>
                          {ratingHtml && (
                            <div className="dest-card-info">
                              <i className="fas fa-star"></i>
                              <span dangerouslySetInnerHTML={{ __html: `${ratingHtml} (${item.rating})` }}></span>
                            </div>
                          )}

                          <p className="dest-card-desc">{itemData.desc || t.noDesc}</p>

                          <div className="dest-card-action">
                            <button className="dest-card-btn" onClick={() => setModalItem(item)}>
                              <i className="fas fa-info-circle"></i> {t.moreDetails}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} onNavigate={setScreen} />

      {/* ===== Modal ===== */}
      {modalItem && (
        <div className="modal-overlay active" onClick={(e) => {
          if (e.target === e.currentTarget) setModalItem(null);
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <img
                className="modal-image"
                src={modalItem.img && modalItem.img.startsWith('http') ? modalItem.img : 'https://placehold.co/700x400/B8860B/white?text=Lombok'}
                alt="Destination"
                onError={(e) => e.currentTarget.src = 'https://placehold.co/700x400/B8860B/white?text=Lombok'}
              />
              <button className="modal-close" onClick={() => setModalItem(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{lang === 'id' ? modalItem.nameId : modalItem.nameEn}</h2>
              <div className="modal-type">{lang === 'id' ? modalItem.typeLabelId : modalItem.typeLabelEn}</div>

              {modalItem.rating && (
                <div className="modal-rating">
                  <span className="stars" dangerouslySetInnerHTML={{
                    __html: Array.from({ length: 5 }, (_, i) =>
                      `<i class="fas fa-star" style="color: ${i < Math.round(parseFloat(modalItem.rating)) ? '#ffc107' : '#ddd'}"></i>`
                    ).join('')
                  }}></span>
                  <span className="rating-value">{modalItem.rating}</span>
                </div>
              )}

              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <label><i className="fas fa-map-marker-alt"></i> {t.modalLocation}</label>
                  <p>{lang === 'id' ? modalItem.locationId : modalItem.locationEn || 'Lombok, Indonesia'}</p>
                </div>
                <div className="modal-info-item">
                  <label><i className="fas fa-clock"></i> {t.modalHours}</label>
                  <p>{lang === 'id' ? modalItem.openingHoursId : modalItem.openingHoursEn || t.noHours}</p>
                </div>
                <div className="modal-info-item">
                  <label><i className="fas fa-tag"></i> {t.modalPrice}</label>
                  <p>{formatPrice(lang === 'id' ? modalItem.priceId : modalItem.priceEn)}</p>
                </div>
                <div className="modal-info-item">
                  <label><i className="fas fa-car"></i> {t.modalTransport}</label>
                  <p>{translateTransport(modalItem.transport)}</p>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">
                  <i className="fas fa-running"></i> {t.modalActivities}
                </h3>
                <p>{lang === 'id' ? modalItem.activityId : modalItem.activityEn || t.noActivity}</p>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">
                  <i className="fas fa-info-circle"></i> {t.modalDesc}
                </h3>
                <p>{lang === 'id' ? modalItem.descId : modalItem.descEn || t.noDesc}</p>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">
                  <i className="fas fa-concierge-bell"></i> {t.modalFacilities}
                </h3>
                <p>{lang === 'id' ? modalItem.facilityId : modalItem.facilityEn || t.noFacility}</p>
              </div>

              {modalItem.video && extractVideoId(modalItem.video) && (
                <div className="modal-section">
                  <h3 className="modal-section-title">
                    <i className="fas fa-video"></i> Video
                  </h3>
                  <div className="video-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractVideoId(modalItem.video)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {modalItem.timeEvents && (
                <div className="modal-section">
                  <h3 className="modal-section-title">
                    <i className="fas fa-calendar-alt"></i> {t.eventTime}
                  </h3>
                  <p>{modalItem.timeEvents}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
