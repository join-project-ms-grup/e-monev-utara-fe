import { useState, useEffect } from 'react';
import AksiButton from './inputs/AksiButton';
import { MdArrowUpward } from 'react-icons/md';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AksiButton
      className={`fixed bottom-6 right-6 bg-[var(--color-2)] hover:bg-[var(--color-2)]! hover:opacity-50 text-white transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      Icon={MdArrowUpward}
    />
  );
}

export default BackToTop;
