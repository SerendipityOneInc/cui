import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { PreferencesModal } from '../PreferencesModal/PreferencesModal';
import { Button } from '@/web/chat/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/web/chat/components/ui/tooltip';

export function Header() {
  const theme = useTheme();
  const [showPrefs, setShowPrefs] = useState(false);
  
  console.log('Header rendering, showPrefs:', showPrefs);
  
  const handleOpenSettings = () => {
    console.log('Header handleOpenSettings called');
    setShowPrefs(true);
  };
  
  const handleCloseSettings = () => {
    console.log('Header handleCloseSettings called');
    setShowPrefs(false);
  };
  
  useEffect(() => {
    console.log('Header useEffect - showPrefs changed to:', showPrefs);
  }, [showPrefs]);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 h-[60px] bg-background font-semibold">
        <div className="relative flex items-center justify-between w-full px-1 py-3">
        </div>
      </header>
    </>
  );
}