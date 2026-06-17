import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const baseStyles = glass
    ? 'glass-card'
    : 'bg-bg-secondary rounded-xl border border-border';

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${paddingStyles[padding]}
        ${hover ? 'cursor-pointer hover:border-border-hover hover:shadow-lg transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
