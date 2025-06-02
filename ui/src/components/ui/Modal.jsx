import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, closeOnOverlayClick = true }) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  // Handle click outside
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'animate-fadeIn' : ''} ${isClosing ? 'animate-fadeOut' : ''}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'ease-out duration-150 opacity-100' : ''} ${isClosing ? 'ease-in duration-150 opacity-0' : ''}`} 
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${isOpen ? 'ease-out duration-150 opacity-100 translate-y-0 sm:scale-100' : ''} ${isClosing ? 'ease-in duration-150 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95' : ''}`}
        >
          {title && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={handleClose}
                    aria-label="Close"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className={title ? 'px-4 pb-5 sm:p-6 sm:pt-0' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;