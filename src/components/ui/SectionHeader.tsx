import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={cn('flex flex-col', alignClass, className)}>
      {label && (
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#578E7E] mb-3">
          {label}
        </span>
      )}
      <div className={cn('w-10 h-0.5 bg-[#578E7E] mb-4', align === 'center' ? 'mx-auto' : '')} />
      <h2
        className={cn(
          'text-3xl md:text-4xl font-bold text-[#3D3D3D] leading-tight',
          'font-serif',
          titleClassName
        )}
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-base md:text-lg text-[#5a5a5a] leading-relaxed max-w-2xl', align === 'center' ? 'mx-auto' : '')}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
