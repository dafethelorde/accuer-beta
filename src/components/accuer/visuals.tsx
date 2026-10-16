import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function GlassCard({
  children,
  className = "",
  light = false,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly light?: boolean;
}) {
  return (
    <article
      className={`accuer-glass-card${light ? " accuer-glass-card--cream" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </article>
  );
}

export function CardPeek({
  label = "Next",
  children,
  light = false,
}: {
  readonly label?: string;
  readonly children: ReactNode;
  readonly light?: boolean;
}) {
  return (
    <div aria-hidden="true" className={`accuer-peek${light ? " accuer-peek--cream" : ""}`}>
      <span className="accuer-section-label">{label}</span>
      <span>{children}</span>
    </div>
  );
}

export function GlassStack({
  children,
  className = "",
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={`accuer-glass-stack${className ? ` ${className}` : ""}`}>
      <div aria-hidden="true" className="accuer-glass-shadow" />
      {children}
    </div>
  );
}

export function ProgressRing({
  percentage,
  light = false,
  label = `${percentage}%`,
}: {
  readonly percentage: number;
  readonly light?: boolean;
  readonly label?: string;
}) {
  const progress = Math.max(0, Math.min(100, percentage));
  const ringStyle: CSSProperties = { "--ring-value": `${progress}%` } as CSSProperties;

  return (
    <div
      className={`accuer-ring${light ? " accuer-ring--cream" : ""}`}
      role="img"
      aria-label={`${progress}% progress`}
      style={ringStyle}
    >
      <span aria-hidden="true" className="accuer-ring__label">{label}</span>
    </div>
  );
}

export function NotchedChip({
  label,
  icon: Icon,
  dark = false,
  compact = false,
}: {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly dark?: boolean;
  readonly compact?: boolean;
}) {
  return (
    <span className={`notched-chip${dark ? " notched-chip--dark" : ""}${compact ? " notched-chip--compact" : ""}`}>
      <span aria-hidden="true" className="notched-chip__tab"><Icon size={12} strokeWidth={1.8} /></span>
      <span>{label}</span>
    </span>
  );
}

function addressSeed(address: string): number {
  let hash = 0;
  for (const character of address.toLowerCase()) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash;
}

export function GeometricAvatar({ address }: { readonly address: string }) {
  const seed = addressSeed(address);
  const geometry = ["one", "two", "three", "four", "five"][seed % 5];
  const tone = seed % 5;

  return (
    <span
      aria-hidden="true"
      className={`accuer-avatar accuer-avatar--${geometry} accuer-avatar-tone-${tone}`}
    >
      <span className="accuer-avatar-mark" />
    </span>
  );
}

export function AvatarStack({ addresses }: { readonly addresses: readonly string[] }) {
  return (
    <div className="accuer-avatar-stack" aria-hidden="true">
      {addresses.slice(0, 5).map((address) => (
        <GeometricAvatar address={address} key={address} />
      ))}
    </div>
  );
}