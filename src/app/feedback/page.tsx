"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          ← Kembali ke Beranda
        </button>

        <h1 style={{
          fontSize: '32px',
          color: '#333',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          💬 Kirim Feedback
        </h1>
        
        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Berikan saran, kritik, atau masukan Anda untuk membantu kami meningkatkan layanan!
        </p>

        {status === 'success' ? (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            padding: '20px',
            color: '#155724',
            textAlign: 'center',
            fontSize: '16px'
          }}>
            ✅ Terima kasih! Feedback Anda telah terkirim.
            <br />
            <small>Anda akan diarahkan ke beranda...</small>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500'
              }}>
                Nama Anda *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Masukkan nama Anda"
                style={{
                  width: '100%',
                  color: '#333',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s',
                }}
                onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500'
              }}>
                Email (opsional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s',
                }}
                onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500'
              }}>
                Pesan / Feedback *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Tulis saran, kritik, atau feedback Anda di sini..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border 0.3s',
                }}
                onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
              />
            </div>

            {status === 'error' && (
              <div style={{
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '12px',
                padding: '12px',
                color: '#721c24',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                ❌ Gagal mengirim feedback. Silakan coba lagi.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                padding: '14px',
                background: status === 'sending' ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                if (status !== 'sending') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {status === 'sending' ? 'Mengirim...' : '📤 Kirim Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
