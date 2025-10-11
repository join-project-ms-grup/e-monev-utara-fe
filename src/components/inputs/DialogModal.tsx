import { type FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

interface DialogModalProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  closeOnOverlay?: boolean;
}

const DialogModal: FC<DialogModalProps> = ({
  title,
  isOpen,
  children,
  onClose,
  closeOnOverlay = false,
}) => {
  const [show, setShow] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  // useEffect(() => {
  //   if (isOpen) {
  //     setShow(true);
  //     setTimeout(() => setAnimateIn(true), 10);
  //   } else {
  //     setAnimateIn(false);
  //     const timeout = setTimeout(() => setShow(false), 300);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [isOpen]);

  // useEffect(() => {
  //   if (isOpen) {
  //     document.documentElement.style.overflow = 'hidden';
  //   } else {
  //     document.documentElement.style.overflow = '';
  //   }

  //   return () => {
  //     document.documentElement.style.overflow = '';
  //   };
  // }, [isOpen]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 10);
      document.documentElement.style.overflow = 'hidden';
    } else {
      setAnimateIn(false);
      timeout = setTimeout(() => setShow(false), 300);
      document.documentElement.style.overflow = '';
    }
    return () => {
      clearTimeout(timeout);
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!show) return null;

  return createPortal(
    <div
      onClick={closeOnOverlay ? () => onClose() : () => {}}
      className={`fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col overflow-hidden bg-[var(--bg-color)] rounded shadow-xl w-11/12 max-w-xl transform transition-all duration-300 ${
          animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className='flex flex-1 border-b border-[#ddd] py-5 px-8 justify-between bg-gray-100'>
          <h4>{title}</h4>
          <button className='transition-all active:scale-90'>
            <MdClose
              onClick={onClose}
              className='text-xl transition-all text-[#aaa] hover:text-[#666]'
            />
          </button>
        </div>
        <div className='flex-1 mt-2 px-6 py-6'>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default DialogModal;
