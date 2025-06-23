import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Context for managing select state
const SelectContext = React.createContext();

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');
  const selectRef = React.useRef(null);

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback((newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setIsOpen(false);
  }, [value, onValueChange]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const contextValue = React.useMemo(() => ({
    isOpen,
    setIsOpen,
    value: currentValue,
    onValueChange: handleValueChange
  }), [isOpen, currentValue, handleValueChange]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" ref={selectRef} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            if (child.type === SelectContent) {
              // Render SelectContent in a portal-like absolute position
              return isOpen ? (
                <div className="absolute top-full left-0 right-0 z-50 mt-1">
                  {child}
                </div>
              ) : null;
            }
            return child;
          }
          return child;
        })}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error('SelectTrigger must be used within a Select component');
  }

  const { isOpen, setIsOpen } = context;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isOpen && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      {...props}
    >
      {children}
      <ChevronDown className={cn(
        "h-4 w-4 opacity-50 transition-transform duration-200",
        isOpen && "rotate-180"
      )} />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }) => {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error('SelectValue must be used within a Select component');
  }

  const { value } = context;
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ className, children, ...props }) => {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error('SelectContent must be used within a Select component');
  }

  const { isOpen } = context;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'relative z-50 min-w-[8rem] max-h-60 overflow-auto rounded-md border bg-white text-gray-950 shadow-lg animate-in fade-in-0 zoom-in-95',
        className
      )}
      role="listbox"
      {...props}
    >
      {children}
    </div>
  );
};

const SelectItem = ({ className, children, value, ...props }) => {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error('SelectItem must be used within a Select component');
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        isSelected && 'bg-blue-50 text-blue-900',
        className
      )}
      onClick={() => onValueChange?.(value)}
      role="option"
      aria-selected={isSelected}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
        </span>
      )}
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
