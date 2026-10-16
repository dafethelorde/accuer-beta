import { useEffect, useState } from "react";

export function usePledgeCountdown(closesAt: string): {
  readonly label: string;
  readonly closed: boolean;
} {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const deadline = Date.parse(closesAt);
  if (!Number.isFinite(deadline)) {
    return { label: "Close date to be announced", closed: false };
  }
  if (now === null) return { label: "Calculating…", closed: false };

  const remaining = deadline - now;
  if (remaining <= 0) return { label: "Beta window closed", closed: true };

  const totalHours = Math.floor(remaining / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return { label: `${days} days · ${hours} hours remaining`, closed: false };
}