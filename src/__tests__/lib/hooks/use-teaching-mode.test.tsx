import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TeachingModeProvider, useTeachingMode } from "@/lib/hooks/use-teaching-mode";

// Mock localStorage since jsdom doesn't always provide it
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
  get length() { return Object.keys(store).length; },
  key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

function TestConsumer() {
  const { teachingMode, teachingExpanded, toggleTeachingMode, toggleTeachingExpanded } =
    useTeachingMode();
  return (
    <div>
      <span data-testid="mode">{String(teachingMode)}</span>
      <span data-testid="expanded">{String(teachingExpanded)}</span>
      <button data-testid="toggle-mode" onClick={toggleTeachingMode} />
      <button data-testid="toggle-expanded" onClick={toggleTeachingExpanded} />
    </div>
  );
}

describe("useTeachingMode", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("defaults teachingExpanded to false", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    expect(screen.getByTestId("expanded").textContent).toBe("false");
  });

  it("toggles teachingExpanded", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    act(() => {
      screen.getByTestId("toggle-expanded").click();
    });
    expect(screen.getByTestId("expanded").textContent).toBe("true");
  });

  it("persists teachingExpanded to localStorage", () => {
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    act(() => {
      screen.getByTestId("toggle-expanded").click();
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith("kairos-teaching-expanded", "true");
  });

  it("reads teachingExpanded from localStorage on mount", () => {
    store["kairos-teaching-expanded"] = "true";
    render(
      <TeachingModeProvider>
        <TestConsumer />
      </TeachingModeProvider>,
    );
    expect(screen.getByTestId("expanded").textContent).toBe("true");
  });
});
