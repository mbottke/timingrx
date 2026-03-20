import Link from "next/link";
import { Attribution } from "./attribution";
import { KairosLogo } from "./kairos-logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t py-6">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-4">
            <KairosLogo variant="footer" />
            <span>Obstetric decision intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground">
              Methodology & Disclaimers
            </Link>
            <span>v1.0.0</span>
          </div>
        </div>
        <Attribution className="mt-4" />
        <p className="mt-3 text-center text-xs text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
          Clinical decision support tool for educational purposes. Not a
          substitute for clinical judgment. Verify all management decisions
          against current institutional protocols.
        </p>
      </div>
    </footer>
  );
}
