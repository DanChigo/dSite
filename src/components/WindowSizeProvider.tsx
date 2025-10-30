import React, {useContext, createContext, useState, useEffect} from 'react';
import type { ReactNode } from "react";


interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmall: boolean; // Keep for backward compatibility
}

const WindowSizeContext = createContext<WindowSize>({
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isSmall: false
});

export function useWindowSize() {
    return useContext(WindowSizeContext);
}

export default function WindowSizeProvider({ children }: { children: ReactNode }) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    isSmall: window.innerHeight <= 680
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isSmall: height <= 680
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
}