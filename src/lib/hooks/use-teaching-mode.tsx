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
  teachingExpanded: boolean;
  toggleTeachingExpanded: () => void;
}

const TeachingModeContext = createContext<TeachingModeContextValue>({
  teachingMode: false,
  toggleTeachingMode: () => {},
  teachingExpanded: false,
  toggleTeachingExpanded: () => {},
});

export function TeachingModeProvider({ children }: { children: ReactNode }) {
  const [teachingMode, setTeachingMode] = useState(false);
  const [teachingExpanded, setTeachingExpanded] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("kairos-teaching-mode");
    if (storedMode === "true") setTeachingMode(true);

    const storedExpanded = localStorage.getItem("kairos-teaching-expanded");
    if (storedExpanded === "true") setTeachingExpanded(true);
  }, []);

  const toggleTeachingMode = useCallback(() => {
    setTeachingMode((prev) => {
      const next = !prev;
      localStorage.setItem("kairos-teaching-mode", String(next));
      return next;
    });
  }, []);

  const toggleTeachingExpanded = useCallback(() => {
    setTeachingExpanded((prev) => {
      const next = !prev;
      localStorage.setItem("kairos-teaching-expanded", String(next));
      return next;
    });
  }, []);

  return (
    <TeachingModeContext.Provider
      value={{ teachingMode, toggleTeachingMode, teachingExpanded, toggleTeachingExpanded }}
    >
      {children}
    </TeachingModeContext.Provider>
  );
}

export function useTeachingMode() {
  return useContext(TeachingModeContext);
}
