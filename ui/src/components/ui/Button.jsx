import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', fullWidth = false, disabled = false, onClick, type = 'button' }) => {
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition duration-150 ease-in-out';
  
  // Size variations
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    success: `bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    link: `bg-transparent text-blue-600 hover:underline focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;