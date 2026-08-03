import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useScrollToSection() {
  const navigate = useNavigate();
  const location = useLocation();

  return (sectionId) => {
    const id = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
    
    function doScroll() {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    if (location.pathname === '/') {
      doScroll();
    } else {
      navigate('/');
      setTimeout(doScroll, 100);
    }
  };
}

export default function ScrollLink({ targetId, className, children, onClick, ...props }) {
  const scrollTo = useScrollToSection();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    scrollTo(targetId);
  };

  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
