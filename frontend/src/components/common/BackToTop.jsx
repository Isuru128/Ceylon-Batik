import React, { useState, useEffect } from 'react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      className="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to Top"
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
};
