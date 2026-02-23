"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategories } from '../lib/categories';

export default function FeedbackPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => router.push('/'), 2500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  const t = lang === 'id' ? {
    title: 'Kirim Feedback',
    subtitle: 'Berikan saran, kritik, atau masukan Anda untuk membantu kami meningkatkan layanan wisata Lombok.',
    nameLabel: 'Nama Lengkap',
    namePlaceholder: 'Masukkan nama Anda',
    emailLabel: 'Email (opsional)',
    emailPlaceholder: 'email@example.com',
    msgLabel: 'Pesan / Feedback',
    msgPlaceholder: 'Tulis saran, kritik, atau feedback Anda di sini...',
    submit: 'Kirim Feedback',
    sending: 'Mengirim...',
    successTitle: 'Terima kasih!',
    successMsg: 'Feedback Anda telah berhasil terkirim. Anda akan diarahkan ke beranda...',
    errorMsg: 'Gagal mengirim feedback. Silakan coba lagi.',
    contactTitle: 'Hubungi Kami',
    contactDesc: 'Kami selalu mendengarkan masukan dari pengunjung.',
    ideasTitle: 'Ide & Saran',
    ideasDesc: 'Punya ide untuk meningkatkan pengalaman wisata? Kami ingin tahu!',
    privacyTitle: 'Privasi Terjaga',
    privacyDesc: 'Data Anda aman dan hanya digunakan untuk meningkatkan layanan.',
  } : {
    title: 'Send Feedback',
    subtitle: 'Share your suggestions, reviews, or feedback to help us improve Lombok tourism services.',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'email@example.com',
    msgLabel: 'Message / Feedback',
    msgPlaceholder: 'Write your suggestions, reviews, or feedback here...',
    submit: 'Send Feedback',
    sending: 'Sending...',
    successTitle: 'Thank you!',
    successMsg: 'Your feedback has been sent successfully. Redirecting to home...',
    errorMsg: 'Failed to send feedback. Please try again.',
    contactTitle: 'Contact Us',
    contactDesc: 'We always listen to visitor feedback.',
    ideasTitle: 'Ideas & Suggestions',
    ideasDesc: 'Have ideas to improve the tourism experience? We want to hear!',
    privacyTitle: 'Privacy Protected',
    privacyDesc: 'Your data is safe and only used to improve our services.',
  };

  return (
    <div className="site-wrapper">
      <Header
        lang={lang}
        setLang={setLang}
        activePage="feedback"
        topBarItems={getCategories(lang).slice(1).map((cat) => ({
          key: cat.key,
          label: cat.label.toUpperCase(),
          onClick: () => { window.location.href = '/?cat=' + cat.key; },
        }))}
      />

      {/* Hero Banner */}
      <section className="feedback-hero">
        <div className="feedback-hero-inner">
          <h1><i className="fas fa-comment-dots"></i> {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <main className="feedback-main">
        <div className="feedback-container">
          <div className="feedback-card">
            {status === 'success' ? (
              <div className="feedback-success">
                <div className="feedback-success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2>{t.successTitle}</h2>
                <p>{t.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="feedback-form">
                <div className="feedback-field">
                  <label>
                    {t.nameLabel} <span className="feedback-required">*</span>
                  </label>
                  <div className="feedback-input-wrap">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={t.namePlaceholder}
                    />
                  </div>
                </div>

                <div className="feedback-field">
                  <label>{t.emailLabel}</label>
                  <div className="feedback-input-wrap">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>

                <div className="feedback-field">
                  <label>
                    {t.msgLabel} <span className="feedback-required">*</span>
                  </label>
                  <div className="feedback-input-wrap feedback-textarea-wrap">
                    <i className="fas fa-pen"></i>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder={t.msgPlaceholder}
                      rows={6}
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="feedback-error">
                    <i className="fas fa-exclamation-triangle"></i> {t.errorMsg}
                  </div>
                )}

                <button type="submit" className="feedback-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><i className="fas fa-spinner fa-spin"></i> {t.sending}</>
                  ) : (
                    <><i className="fas fa-paper-plane"></i> {t.submit}</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="feedback-sidebar">
            <div className="feedback-sidebar-card">
              <div className="feedback-sidebar-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>{t.contactTitle}</h3>
              <p>{t.contactDesc}</p>
            </div>
            <div className="feedback-sidebar-card">
              <div className="feedback-sidebar-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>{t.ideasTitle}</h3>
              <p>{t.ideasDesc}</p>
            </div>
            <div className="feedback-sidebar-card">
              <div className="feedback-sidebar-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>{t.privacyTitle}</h3>
              <p>{t.privacyDesc}</p>
            </div>
          </aside>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
