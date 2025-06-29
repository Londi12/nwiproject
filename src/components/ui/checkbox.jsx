import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white',
      className
    )}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    {checked && (
      <Check className="h-3 w-3 text-white" />
    )}
  </button>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
