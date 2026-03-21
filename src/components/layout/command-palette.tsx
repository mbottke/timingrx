"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { allConditions } from "@/data/conditions";
import { useTeachingMode } from "@/lib/hooks/use-teaching-mode";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { toggleTeachingMode, teachingMode } = useTeachingMode();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      setOpen(false);
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search conditions, pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => navigate("/conditions")}>
            Conditions
          </CommandItem>
          <CommandItem onSelect={() => navigate("/calculator")}>
            Risk Calculator
          </CommandItem>
          <CommandItem onSelect={() => navigate("/evidence")}>
            Evidence Library
          </CommandItem>
          <CommandItem onSelect={() => navigate("/physiology")}>
            Physiology
          </CommandItem>
          <CommandItem onSelect={() => navigate("/compare")}>
            Compare Conditions
          </CommandItem>
          <CommandItem onSelect={() => navigate("/scenarios")}>
            Scenarios
          </CommandItem>
          <CommandItem onSelect={() => navigate("/methodology")}>
            Methodology
          </CommandItem>
          <CommandItem onSelect={() => navigate("/data-quality")}>
            Data Quality
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => {
              toggleTeachingMode();
              setOpen(false);
            }}
          >
            {teachingMode ? "Disable" : "Enable"} Teaching Mode
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Conditions">
          {allConditions.map((condition) => (
            <CommandItem
              key={condition.id}
              value={condition.name}
              onSelect={() => navigate(`/conditions/${condition.id}`)}
            >
              {condition.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
