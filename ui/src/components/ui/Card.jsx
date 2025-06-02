import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '', 
  footerClassName = '', 
  shadow = 'md',
  hover = false,
  padding = 'normal'
}) => {
  // Shadow options
  const shadowOptions = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Padding options
  const paddingOptions = {
    none: 'p-0',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6'
  };

  // Hover effect
  const hoverEffect = hover ? 'transition-all duration-200 ease-in-out hover:shadow-lg' : '';

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${shadowOptions[shadow]} ${hoverEffect} ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingOptions[padding]} ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${paddingOptions[padding]} ${bodyClassName}`}>{children}</div>
      
      {footer && (
        <div className={`border-t border-gray-200 ${paddingOptions[padding]} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;