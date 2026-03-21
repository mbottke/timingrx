"use client";

import { calculatorPresets } from "@/data/calculator-presets";
import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (preset: { factorIds: string[]; defaultGA: number }) => void;
}

export function PresetSelector({ onSelect }: Props) {
  const grouped = calculatorPresets.reduce<
    Record<string, typeof calculatorPresets>
  >((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {});

  return (
    <div className="mb-4 rounded-lg border bg-card p-4">
      <h2 className="text-sm font-semibold mb-3">Quick Scenarios</h2>
      <div className="space-y-3">
        {Object.entries(grouped).map(([category, presets]) => (
          <div key={category}>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              {category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  title={preset.description}
                  onClick={() =>
                    onSelect({
                      factorIds: preset.factorIds,
                      defaultGA: preset.defaultGA,
                    })
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
