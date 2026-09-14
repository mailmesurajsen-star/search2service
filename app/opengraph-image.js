import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #0F1C3F, #0E9384)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: 'white', letterSpacing: -1 }}>
            Search2Service
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#5EEAD4', fontWeight: 500, textAlign: 'center', maxWidth: 900 }}>
          Find trusted local services near you — in seconds
        </div>
      </div>
    ),
    { ...size }
  );
}
