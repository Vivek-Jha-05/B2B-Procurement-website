import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-sm cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-[#578E7E] text-[#FFFAEC] hover:bg-[#3a6b5e] focus:ring-[#578E7E] shadow-sm hover:shadow-md active:scale-[0.98]',
      secondary:
        'bg-[#3D3D3D] text-[#FFFAEC] hover:bg-[#2a2a2a] focus:ring-[#3D3D3D] shadow-sm hover:shadow-md active:scale-[0.98]',
      outline:
        'border-2 border-[#578E7E] text-[#578E7E] hover:bg-[#578E7E] hover:text-[#FFFAEC] focus:ring-[#578E7E] bg-transparent',
      ghost:
        'text-[#578E7E] hover:bg-[#F5ECD5] focus:ring-[#578E7E] bg-transparent',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base tracking-wide',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
