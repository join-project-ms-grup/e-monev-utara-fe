import { type FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

interface DialogModalProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  closeOnOverlay?: boolean;
  widthLevel?: number;
}

const DialogModal: FC<DialogModalProps> = ({
  title,
  isOpen,
  children,
  onClose,
  closeOnOverlay = false,
  widthLevel = 3,
}) => {
  const [show, setShow] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const getWidthClass = () => {
    switch (widthLevel) {
      case 1:
        return 'max-w-sm';
      case 2:
        return 'max-w-md';
      case 3:
        return 'max-w-lg';
      case 4:
        return 'max-w-xl';
      case 5:
        return 'max-w-2xl';
      case 6:
        return 'max-w-3xl';
      case 7:
        return 'max-w-4xl';
      case 8:
        return 'max-w-5xl';
      case 9:
        return 'max-w-6xl';
      case 10:
        return 'max-w-7xl';
      default:
        return 'max-w-xl';
    }
  };

  if (!show) return null;

  return createPortal(
    <div
      onClick={closeOnOverlay ? () => onClose() : () => {}}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        animateIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col overflow-hidden bg-[var(--bg-color)] rounded shadow-xl w-11/12 ${getWidthClass()} transform transition-all duration-300 ${
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
        {/* <div className='flex-1 mt-2 px-6 py-6'>{children}</div> */}
        <div className='flex-1 mt-2 px-6 py-6 max-h-[80vh] overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DialogModal;
