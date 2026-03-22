import Link from "next/link";
import { KairosLogo } from "./kairos-logo";

export function Footer() {
  return (
    <footer className="mt-auto py-6">
      <div className="kairos-divider mb-6" />
      <div className="mx-auto max-w-7xl px-4 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-4">
            <KairosLogo variant="footer" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/methodology" className="hover:text-foreground">
              Methodology
            </Link>
            <Link href="/about" className="hover:text-foreground">
              Clinical Disclaimer
            </Link>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
