import { cn } from "@/lib/utils";

export interface AttributionProps {
  className?: string;
}

/**
 * Personal branding attribution mark.
 * Drop this component into any app's footer for consistent author identity.
 */
export function Attribution({ className }: AttributionProps) {
  return (
    <p
      className={cn(
        "text-center text-xs tracking-wide text-muted-foreground/90",
        className
      )}
    >
      Crafted by{" "}
      <span className="font-medium text-foreground/70">
        Michael Bottke, MD
      </span>
    </p>
  );
}
