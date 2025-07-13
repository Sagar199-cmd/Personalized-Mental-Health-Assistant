import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  if (src) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden ${sizes[size]} ${cursorClass} ${className}`}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  
  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-gray-500 text-white font-medium
        ${sizes[size]} ${cursorClass} ${className}
      `}
      onClick={onClick}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
};

export default Avatar;