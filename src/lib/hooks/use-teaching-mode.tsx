"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface TeachingModeContextValue {
  teachingMode: boolean;
  toggleTeachingMode: () => void;
}

const TeachingModeContext = createContext<TeachingModeContextValue>({
  teachingMode: false,
  toggleTeachingMode: () => {},
});

export function TeachingModeProvider({ children }: { children: ReactNode }) {
  const [teachingMode, setTeachingMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("timingrx-teaching-mode");
    if (stored === "true") setTeachingMode(true);
  }, []);

  const toggleTeachingMode = useCallback(() => {
    setTeachingMode((prev) => {
      const next = !prev;
      localStorage.setItem("timingrx-teaching-mode", String(next));
      return next;
    });
  }, []);

  return (
    <TeachingModeContext.Provider value={{ teachingMode, toggleTeachingMode }}>
      {children}
    </TeachingModeContext.Provider>
  );
}

export function useTeachingMode() {
  return useContext(TeachingModeContext);
}
