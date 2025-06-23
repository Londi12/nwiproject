import React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext();

const Tabs = ({ defaultValue, value, children, className, onValueChange, ...restProps }) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultValue || '');

  // Determine if this is controlled or uncontrolled
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const handleTabChange = React.useCallback((newValue) => {
    // For uncontrolled mode, update internal state
    if (!isControlled) {
      setInternalActiveTab(newValue);
    }

    // Always call onValueChange if provided
    if (onValueChange && typeof onValueChange === 'function') {
      onValueChange(newValue);
    }
  }, [isControlled, onValueChange]);

  const contextValue = React.useMemo(() => ({
    activeTab,
    setActiveTab: handleTabChange
  }), [activeTab, handleTabChange]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)} {...restProps}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { activeTab, setActiveTab } = context;

  const handleClick = React.useCallback(() => {
    if (setActiveTab && typeof setActiveTab === 'function') {
      setActiveTab(value);
    }
  }, [setActiveTab, value]);

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        activeTab === value
          ? 'bg-white text-gray-950 shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
        className
      )}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsContent, TabsList, TabsTrigger };
