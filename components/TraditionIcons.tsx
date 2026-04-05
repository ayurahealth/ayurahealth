import React from 'react';

export const AyurvedaIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L15 5M12 2L9 5M12 2V22M12 8C14.5 8 16.5 10 16.5 12.5S14.5 17 12 17M12 8C9.5 8 7.5 10 7.5 12.5S9.5 17 12 17M6 10C6 10 2 11 2 12.5S6 15 6 15M18 10C18 10 22 11 22 12.5S18 15 18 15" />
  </svg>
);

export const TCMIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2C12 2 15 7 12 12C9 17 12 22 12 22" />
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="16.5" r="1.5" stroke="none" fill="currentColor" />
  </svg>
);

export const WesternIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 12.5l3-3m0 0l3 3m-3-3V19M16.5 11l3-3m0 0l3 3m-3-3V19" />
    <circle cx="7.5" cy="6" r="2" />
    <circle cx="19.5" cy="6" r="2" />
  </svg>
);

export const TibetanIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 22H22L12 2Z" />
    <circle cx="12" cy="13" r="3" />
    <path d="M12 10V16M9 13H15" />
  </svg>
);

export const SiddhaIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L14 10H22L15 15L17 22L12 18L7 22L9 15L2 10H10L12 2Z" />
  </svg>
);

export const traditionIcons: Record<string, React.ReactNode> = {
  ayurveda: <AyurvedaIcon />,
  tcm: <TCMIcon />,
  western: <WesternIcon />,
  tibetan: <TibetanIcon />,
  siddha: <SiddhaIcon />,
  homeopathy: <span>💧</span>,
  naturopathy: <span>🌱</span>,
  unani: <span>🌙</span>,
};
