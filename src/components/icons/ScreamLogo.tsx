import type { SVGProps } from 'react';

export function ScreamLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RAREFIND Logo"
      {...props}
    >
      {/* Scream character face */}
      <path d="M50 10 C 30 10, 20 30, 20 50 C 20 70, 30 90, 50 90 C 70 90, 80 70, 80 50 C 80 30, 70 10, 50 10 Z" fill="hsl(var(--card-foreground))" opacity="0.1" />
      <ellipse cx="50" cy="50" rx="30" ry="40" fill="hsl(var(--foreground))" />
      {/* Eyes */}
      <ellipse cx="40" cy="40" rx="5" ry="10" fill="hsl(var(--background))" />
      <ellipse cx="60" cy="40" rx="5" ry="10" fill="hsl(var(--background))" />
      {/* Mouth */}
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="hsl(var(--background))" />
      
      {/* Phone */}
      <rect x="65" y="45" width="15" height="25" rx="3" ry="3" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
      <rect x="68" y="48" width="9" height="15" fill="hsl(var(--background))" opacity="0.7" />
      <circle cx="72.5" cy="66" r="1" fill="hsl(var(--primary-foreground))" />

      {/* Hand (simple representation) */}
      <path d="M60 55 Q 65 50, 70 55" fill="none" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
