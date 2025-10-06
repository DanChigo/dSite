import React, {useContext, createContext} from 'react';
import type { ReactNode } from "react";

const WindowSizeContext = createContext(false);

export function useWindowSize() {
    return useContext(WindowSizeContext);
}

export default function WindowSizeProvider({ children }: { children: ReactNode }) {
  const windowHeight = window.innerHeight;
  let windowSmall = true;
  if (windowHeight > 680) {
    windowSmall = false;
  }

  return (
    <WindowSizeContext.Provider value={windowSmall}>
      {children}
    </WindowSizeContext.Provider>
  );
}