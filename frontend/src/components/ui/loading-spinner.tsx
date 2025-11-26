import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', text, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    const borderClasses = {
      sm: 'border-2',
      md: 'border-3',
      lg: 'border-4',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <div className="relative">
          <div
            className={cn(
              'animate-spin rounded-full border-blue-600 border-t-transparent',
              sizeClasses[size],
              borderClasses[size]
            )}
          />
        </div>
        {text && (
          <span className="ml-3 text-sm text-gray-600 animate-pulse">
            {text}
          </span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };