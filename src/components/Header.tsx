import { profile } from "@/data/profile";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#publications", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-muted md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
