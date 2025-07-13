import React, { useState } from 'react';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || tabs[0]?.id || '');
  
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  const getTabStyles = (tabId: string) => {
    const isActive = tabId === activeTabId;
    
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-blue-100 text-blue-700 font-medium'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100';
      
      case 'underline':
        return isActive
          ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
          : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300';
      
      default:
        return isActive
          ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
          : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent';
    }
  };
  
  const tabsContainerClass = variant === 'pills' 
    ? 'flex space-x-2 p-1 bg-gray-50 rounded-lg' 
    : 'flex space-x-8 border-b border-gray-200';
  
  const tabClass = variant === 'pills'
    ? 'px-3 py-2 rounded-md text-sm transition-colors'
    : 'px-1 py-4 text-sm transition-colors';
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  return (
    <div className={className}>
      <div className={tabsContainerClass}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${tabClass} ${getTabStyles(tab.id)}`}
            onClick={() => handleTabClick(tab.id)}
            aria-selected={tab.id === activeTabId}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;