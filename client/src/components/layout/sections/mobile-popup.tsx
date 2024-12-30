"use client";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import React, { useEffect, useState } from 'react'

export const MobilePopup = () => {
    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Hide popup after 3 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // 1000ms initial delay + 3000ms display time

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
      <Alert className="relative border-primary/30 bg-background/95 backdrop-blur">
        <AlertTitle className="text-lg font-semibold">
          Better on Desktop
        </AlertTitle>
        <AlertDescription className="text-muted-foreground">
          For the best experience, we recommend viewing this website on a desktop device.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default MobilePopup