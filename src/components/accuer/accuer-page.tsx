import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  CircleDashed,
  CircleHelp,
  Copy,
  ExternalLink,
  Feather,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  MoveRight,
  Plus,
  Radio,
  Shield,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";

import {
  config,
  type PledgeEvent,
} from "@/config";
import { usePledgeCountdown } from "@/hooks/use-pledge-preview";
import {
  createCommunityDataAdapter,
  type DataAdapterResponse,
  type PledgePreviewData,
} from "@/lib/accuer-data-adapter";
import {
  restoreBetaAccess,
  verifyInviteCode,
} from "@/lib/accuer-invites";
import { simulateRoute, type RouteData } from "@/lib/accuer-simulator";
import { Button } from "@/components/ui/button";
import {
  AvatarStack,
  GlassCard,
  GlassStack,
  NotchedChip,
  ProgressRing,
} from "@/components/accuer/visuals";

const simulatorAvailable =
  config.features.routeSimulation &&
  config.mode === "PREVIEW" &&
  typeof window !== "undefined";

const communityAdapter = createCommunityDataAdapter({
  mode: config.mode,
  community: {
    goal: config.community.sampleGoal,
    totalPledged: config.community.sampleTotal,
    pledgerCount: config.community.samplePledgerCount,
    remainingInvites: config.community.sampleRemainingInvites,
    events: config.community.sampleEvents,
  },
});

const formatPreviewAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);

const formatAddress = (address: string) =>
  `${address.slice(0, 8)}…${address.slice(-5)}`;

const formatRelativeTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
};

function StageChip({
  label,
  active,
}: {
  readonly label: string;
  readonly active: boolean;
}) {
  return (
    <NotchedChip
      label={label}
      icon={active ? Check : CircleDashed}
      dark
      compact
    />
  );
}

function PreviewBadge({ className = "" }: { readonly className?: string }) {
  return (
    <span
      className={`inline-flex min-h-[27px] items-center gap-1.5 rounded-full border border-current/20 px-3 font-mono text-[10px] uppercase tracking-[0.02em]${className ? ` ${className}` : ""}`}
    >
      <CircleDashed aria-hidden="true" size={11} />
      Preview data
    </span>
  );
}

function BrandButtonLink({
  children,
  href,
  className = "",
}: {
  readonly children: React.ReactNode;
  readonly href: string;
  readonly className?: string;
}) {
  return (
    <Button variant="pill" asChild className={className}>
      <a href={href}>{children}</a>
    </Button>
  );
}

function HomeLogo() {
  return (
    <Link aria-label="Accuer home" className="accuer-wordmark" to="/">
      Accuer
    </Link>
  );
}

function Navigation() {
  return (
    <header className="accuer-nav">
      <nav
        aria-label="Main navigation"
        className="accuer-container flex min-h-[67px] items-center justify-between gap-3"
      >
        <HomeLogo />
        <div className="flex items-center gap-3 min-[420px]:gap-6 sm:gap-8">
          <a className="accuer-nav-link hidden min-[400px]:inline" href="#how-it-works">
            How it works
          </a>
          <a className="accuer-nav-link" href="#invite">
            Beta
          </a>
          <a className="accuer-nav-link" href="#faq">
            FAQ
          </a>
          <BrandButtonLink className="!min-h-[40px] !px-[17px] !text-[12px]" href="#invite">
            Enter beta <ArrowRight aria-hidden="true" size={13} />
          </BrandButtonLink>
        </div>
      </nav>
    </header>
  );
}

function RouteIllustration() {
  return (
    <div
      aria-label="An illustrative, simulated preview of an Accuer routing card"
      className="accuer-hero-art"
      role="img"
    >
      <div aria-hidden="true" className="accuer-ink-panel accuer-hero-art-panel">
        <span className="accuer-hero-art-note">INTERFACE STUDY · PREVIEW</span>
      </div>
      <GlassStack>
        <div className="accuer-glass-card accuer-route-preview-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <ProgressRing percentage={25} />
              <div>
                <p className="accuer-section-label !text-[9px] !text-cream/70">Illustrative route</p>
                <h2 className="accuer-display mt-1 text-[19px]">Your next best path</h2>
              </div>
            </div>
            <span className="accuer-mono pt-1 text-[10px] text-cream/70">01 / 04</span>
          </div>
          <div className="my-6 space-y-3" aria-hidden="true">
            <div className="h-px bg-cream/20" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-cream/75">Tokenized treasuries</span>
              <MoveRight size={14} className="text-cream/65" />
              <span className="accuer-mono text-[10px]">BEST PATH</span>
            </div>
            <div className="h-px bg-cream/20" />
          </div>
          <div className="accuer-chip-list">
            <StageChip label="Intent parsed" active />
            <StageChip label="Preview only" active={false} />
          </div>
          <p className="mt-5 text-[11px] leading-[1.7] text-cream/70">
            A first look at a more considered way to route tokenized assets.
          </p>
        </div>
        <div aria-hidden="true" className="accuer-peek">
          <span className="accuer-section-label">Next</span>
          <span>Compare simulated routes</span>
          <ArrowDownRight aria-hidden="true" className="ml-auto" size={14} />
        </div>
      </GlassStack>
    </div>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="accuer-container durer-hero-wrap">
      <div className="accuer-hero-grid">
        <div className="accuer-hero">
          <p className="accuer-section-label">A new layer for tokenized markets</p>
          <h1 className="accuer-hero-title" id="hero-heading">
            Agent-signed, post-quantum-verified routing for tokenized assets
          </h1>
          <p className="accuer-hero-copy">
            Accuer finds the best path for your swap, signs it with quantum-resistant
            keys and enforces it onchain through a Uniswap v4 hook.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <BrandButtonLink href="#invite">
              Enter beta <ArrowRight aria-hidden="true" size={15} />
            </BrandButtonLink>
            <a className="accuer-outline-button inline-flex items-center gap-2" href="#how-it-works">
              See how it works <ArrowDown aria-hidden="true" size={14} />
            </a>
          </div>
          <div aria-label="Accuer product principles" className="accuer-chip-list mt-8">
            <NotchedChip label="Quantum-resistant signatures" icon={Shield} />
            <NotchedChip label="Agent-driven routing" icon={Sparkles} />
            <NotchedChip label="Onchain enforcement" icon={CheckCheck} />
          </div>
        </div>
        <RouteIllustration />
      </div>
    </section>
  );
}

function InviteGate({
  onUnlock,
}: {
  readonly onUnlock: () => void;
}) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "checking" || !config.features.inviteGate) return;

    setStatus("checking");
    setMessage("");

    try {
      const result = await verifyInviteCode(code, config.invite);
      if (!result.ok) {
        setStatus("error");
        setMessage(
          result.reason === "unavailable"
            ? "Invite verification is unavailable in this browser. Enable secure browsing and try again."
            : "This invite code is invalid or has already been used.",
        );
        inputRef.current?.focus();
        return;
      }

      setStatus("success");
      setMessage("Access granted. Welcome to the Accuer beta.");
      onUnlock();
    } catch {
      setStatus("error");
      setMessage("This invite code is invalid or has already been used.");
      inputRef.current?.focus();
    }
  }

  return (
    <section aria-labelledby="invite-title" className="accuer-container py-[76px] sm:py-[100px]" id="invite">
      <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.1fr] lg:gap-[86px]">
        <div className="max-w-[390px]">
          <p className="accuer-section-label">02 — A more thoughtful market</p>
          <h2 className="accuer-display mt-4 text-4xl leading-[1.07] sm:text-[47px]" id="invite-title">
            An invitation to rethink how swaps find their way.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.8] text-secondary-ink">
            We are opening Accuer to a small group of invited participants while we
            shape the beta together.
          </p>
          <div aria-hidden="true" className="mt-8 h-px w-full bg-secondary-ink/15" />
          <div className="mt-5 flex items-center gap-3 text-secondary-ink">
            <div className="grid size-9 place-items-center rounded-full border border-secondary-ink/15 bg-light-cream">
              <LockKeyhole aria-hidden="true" size={15} strokeWidth={1.65} />
            </div>
            <p className="text-[12px] leading-[1.65]">Private access. No wallet connection. No funds collected.</p>
          </div>
        </div>

        <GlassStack className="mx-auto w-full max-w-[455px]">
          <GlassCard light className="!p-6 sm:!p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-sage-light">
                  <KeyRound aria-hidden="true" size={15} />
                </span>
                <p className="accuer-section-label">Beta access</p>
              </div>
              <ProgressRing percentage={status === "success" ? 100 : 25} light />
            </div>
            <h3 className="accuer-display mt-5 text-[27px] leading-[1.15]">Private beta access</h3>
            <p className="mt-2.5 text-[13px] leading-[1.75] text-secondary-ink">
              Accuer is open to invited participants during the beta. Enter your
              invite code to continue.
            </p>
            <form className="mt-6" onSubmit={submitCode}>
              <label className="accuer-form-label" htmlFor={inputId}>Invite code</label>
              <input
                ref={inputRef}
                id={inputId}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="accuer-input"
                type="password"
                name="invite-code"
                maxLength={128}
                placeholder="Enter your invite code"
                value={code}
                disabled={status === "success"}
                required
                aria-invalid={status === "error"}
                aria-describedby={message ? errorId : undefined}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
              />
              <p
                aria-atomic="true"
                aria-live={status === "checking" ? "polite" : "assertive"}
                className={`mt-2 min-h-[19px] text-[12px] leading-[1.55] ${status === "error" ? "text-ink" : status === "success" ? "text-secondary-ink" : "text-muted-ink"}`}
                id={errorId}
                role={status === "idle" ? undefined : "status"}
              >
                {status === "checking" ? "Checking your invitation…" : message}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-[12px] font-medium text-muted-ink">
                  {status === "success" ? "Invitation accepted" : "Invite only"}
                </p>
                <Button
                  className="min-h-[45px] gap-2 rounded-full bg-ink px-5 text-cream shadow-sm hover:bg-secondary-ink active:scale-[0.985]"
                  type="submit"
                  disabled={status === "checking" || status === "success"}
                >
                  {status === "checking" ? "Checking…" : status === "success" ? "Access granted" : "Verify code"}
                  {status === "checking" ? null : status === "success" ? <Check aria-hidden="true" size={15} /> : <ArrowRight aria-hidden="true" size={15} />}
                </Button>
              </div>
            </form>
          </GlassCard>
          <div aria-hidden="true" className="accuer-peek accuer-peek--cream">
            <span className="accuer-section-label">Next</span>
            <span>Route your intent</span>
            <ArrowDownRight aria-hidden="true" className="ml-auto" size={14} />
          </div>
        </GlassStack>
      </div>
      <p className="mx-auto mt-8 max-w-4xl text-center text-[11px] leading-[1.75] text-muted-ink">
        Invitations are verified in this browser for the prototype. Browser-only
        checks cannot guarantee single use across other devices or browsers.
      </p>
    </section>
  );
}

function RouteCommitment({ data }: { readonly data: RouteData }) {
  const [copied, setCopied] = useState(false);

  async function copyCommitment() {
    try {
      await navigator.clipboard.writeText(data.commitmentHash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section aria-labelledby="commitment-heading" className="rounded-[22px] border border-cream/20 bg-cream/[0.045] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Fingerprint aria-hidden="true" size={16} />
          <h3 className="accuer-display text-[17px]" id="commitment-heading">Route commitment</h3>
        </div>
        <span className="rounded-full border border-cream/20 px-3 py-1 font-mono text-[9px] uppercase text-cream/75">
          Mock only
        </span>
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase text-cream/65">Mock WOTS+ commitment hash</p>
      <div className="mt-2 flex min-w-0 items-center gap-2 rounded-xl border border-cream/20 bg-ink/35 px-3 py-3 sm:px-4">
        <code className="min-w-0 flex-1 break-all font-mono text-[10px] leading-[1.8] text-cream/90" title={data.commitmentHash}>
          {data.commitmentHash}
        </code>
        <Button
          aria-label={copied ? "Commitment hash copied" : "Copy commitment hash"}
          className="size-10 flex-none rounded-full text-cream hover:bg-cream/10"
          size="icon"
          title="Copy commitment hash"
          type="button"
          variant="ghost"
          onClick={copyCommitment}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      </div>
      <p className="mt-3 font-mono text-[10px] text-cream/75">
        Mock one-time key index <span className="text-cream">#{data.oneTimeKeyIndex}</span>
      </p>
      <p className="mt-3 text-[11px] leading-[1.75] text-cream/70">
        Each signing key is used once and rotates after every intent. This illustration
        creates no signature and commits nothing onchain.
      </p>
    </section>
  );
}

function HopDiagram({ hops }: { readonly hops: RouteData["hops"] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="accuer-display text-[18px]">Simulated route hops</h3>
        <span className="text-[10px] text-cream/65">All figures are simulated estimates.</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {hops.map((hop, index) => (
          <article className="accuer-hop-card p-4" key={hop.poolName}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-medium">{hop.poolName}</p>
              <span className="font-mono text-[9px] text-cream/65">HOP 0{index + 1}</span>
            </div>
            <p className="accuer-mono mt-4 text-[21px]">
              {hop.expectedOutput.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              <span className="ml-1.5 text-[10px] text-cream/70">t-bill units</span>
            </p>
            <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-cream/15 pt-3 text-[10px] text-cream/75">
              <span>Fee {hop.feeBps} bps</span>
              <span>Impact {hop.priceImpactBps} bps</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RouteComparison({ data }: { readonly data: RouteData }) {
  const comparisons = [data.selectedRoute, data.directPool];

  return (
    <div>
      <h3 className="accuer-display mb-3 text-[18px]">Route comparison</h3>
      <div className="overflow-hidden rounded-[19px] border border-cream/20">
        {comparisons.map((route, index) => (
          <div
            className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5 ${index > 0 ? "border-t border-cream/20" : ""}`}
            key={route.name}
          >
            <div>
              <p className="text-[12px] font-medium">{route.name}</p>
              <p className="mt-1 text-[10px] text-cream/65">
                {index === 0 ? "Selected sample path" : "Reference path"}
              </p>
            </div>
            <p className="accuer-mono text-[15px] sm:text-[17px]">
              {route.expectedOutput.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-cream/20 bg-cream/[0.06] px-4 py-3 sm:px-5">
          <p className="text-[11px] text-cream/80">Estimated savings · simulated</p>
          <p className="accuer-mono text-[13px]">{data.simulatedSavingsBps} bps</p>
        </div>
      </div>
    </div>
  );
}

function RoutePreview({ onReturn }: { readonly onReturn: () => void }) {
  const intentId = useId();
  const [intent, setIntent] = useState("");
  const [data, setData] = useState<RouteData | null>(null);
  const [completedStage, setCompletedStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function runSimulation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!simulatorAvailable || running || intent.trim().length < 8) return;

    setRunning(true);
    setError("");
    setCompletedStage(0);
    setData(null);

    try {
      const response = await simulateRoute(intent);
      setData(response.data);
      setRunning(false);
      for (const [index, stage] of response.data.stages.entries()) {
        if (index === 0) continue;
        window.setTimeout(() => setCompletedStage((value) => Math.max(value, stage.progress)), index * 420);
      }
    } catch {
      setError("The route preview could not run. Please revise the intent and try again.");
      setRunning(false);
    }
  }

  return (
    <section className="accuer-ink-panel arriver-ink-wrap mx-auto w-full overflow-visible px-4 sm:px-8" id="route-preview">
      <div aria-labelledby="route-title" className="accuer-container py-[67px] sm:py-[87px]">
        <div className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-[76px]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="accuer-section-label accruer-section-label--light">03 — The routing desk</p>
              <span className="rounded-full border border-cream/20 px-3 py-1 font-mono text-[9px] uppercase text-cream/80">
                Simulated route
              </span>
            </div>
            <h2 className="accuer-display mt-5 max-w-[480px] text-[39px] leading-[1.05] sm:text-[49px]" id="route-title">
              Route your intent
            </h2>
            <p className="mt-4 max-w-[445px] text-[14px] leading-[1.85] text-cream/80">
              Describe the swap you want and Accuer builds, signs and verifies the best route.
            </p>
            <p className="mt-4 max-w-[445px] text-[11px] leading-[1.8] text-cream/70">
              The intended architecture is shown for illustration only. This preview
              does not create a signature, verify a hook or send a transaction.
            </p>
            <div className="mt-7">
              <NotchedChip label="Preview · simulated" icon={CircleDashed} dark />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[650px]">
            <GlassStack>
              <GlassCard className="!p-5 sm:!p-7">
                <form onSubmit={runSimulation}>
                  <label className="accuer-form-label !text-cream" htmlFor={intentId}>
                    Describe a swap
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      className="accuer-input min-w-0 flex-1 !border-cream/20 !bg-ink/45 !text-cream placeholder:!text-cream/55 focus:!border-cream/60 focus:!ring-cream/20"
                      id={intentId}
                      maxLength={180}
                      minLength={8}
                      placeholder="Swap 500 USDC into tokenized T-bills at best price"
                      required
                      value={intent}
                      onChange={(event) => setIntent(event.target.value)}
                    />
                    <Button
                      className="min-h-[49px] shrink-0 gap-2 rounded-full bg-cream px-5 text-ink hover:bg-light-cream active:scale-[0.985]"
                      disabled={running || !simulatorAvailable}
                      type="submit"
                    >
                      {running ? "Simulating…" : "Find best route"}
                      {!running && <ArrowRight aria-hidden="true" size={15} />}
                    </Button>
                  </div>
                  <div className="mt-3 flex min-h-[20px] items-center justify-between gap-3 text-[11px] text-cream/65">
                    <p className="flex items-center gap-1.5"><CircleDashed aria-hidden="true" size={12} /> Simulated · no transaction</p>
                    {data ? <p>{data.stages[completedStage === 100 ? 3 : Math.max(0, Math.floor(completedStage / 25))]?.label}</p> : null}
                  </div>
                  {error && <p aria-live="assertive" className="mt-2 text-[12px] text-cream" role="alert">{error}</p>}
                  <p className="sr-only" aria-live="polite" aria-atomic="true">
                    {running ? "Running a simulated route preview." : completedStage === 100 ? "Simulated route preview complete. No route was signed or sent." : ""}
                  </p>
                </form>

                {data ? (
                  <div aria-label="Simulated route results" className="accuer-route-stage mt-6 space-y-6 border-t border-cream/20 pt-6" key={data.commitmentHash}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <ProgressRing percentage={completedStage} label={`${completedStage}%`} />
                        <div>
                          <p className="accuer-section-label !text-[9px] !text-cream/70">Simulated route</p>
                          <p className="mt-1 text-[12px] font-medium">Sampled, not executed</p>
                        </div>
                      </div>
                      <p className="accuer-mono text-[10px] text-cream/75">{data.hops.length} sample hops</p>
                    </div>

                    <div aria-label="Route simulation stages" className="accuer-stage-row">
                      {data.stages.map((stage) => (
                        <div className="accuer-route-stage" key={stage.id}>
                          <StageChip label={stage.label} active={completedStage >= stage.progress} />
                          <p className="mt-2 pl-1 text-[9px] leading-[1.55] text-cream/65">
                            {stage.id === "route-signed"
                              ? "No signature generated"
                              : stage.id === "hook-verified"
                                ? "No onchain verification"
                                : stage.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <HopDiagram hops={data.hops} />
                    <RouteComparison data={data} />
                    <RouteCommitment data={data} />
                  </div>
                ) : (
                  <div className="mt-5 border-t border-cream/20 pt-4">
                    <p className="flex items-start gap-2 text-[11px] leading-[1.75] text-cream/75">
                      <CircleDashed aria-hidden="true" className="mt-0.5 shrink-0" size={13} />
                      Sample pool paths, reference prices and commitment previews are
                      illustrative estimates, not live market data.
                    </p>
                  </div>
                )}
              </GlassCard>
              <div aria-hidden="true" className="accuer-peek">
                <span className="accuer-section-label">Next</span>
                <span>Review the beta pledge preview</span>
                <ArrowDownRight aria-hidden="true" className="ml-auto" size={14} />
              </div>
            </GlassStack>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-cream/20 pt-5">
          <p className="flex items-center gap-2 text-[11px] text-cream/75">
            <ShieldCheck aria-hidden="true" size={14} /> No wallet access. No signing. No funds.
          </p>
          <Button
            variant="ghost"
            className="min-h-[38px] gap-2 rounded-full px-4 text-cream hover:bg-cream/10"
            type="button"
            onClick={onReturn}
          >
            Return to the invitation <ArrowUpRight aria-hidden="true" size={14} />
          </Button>
        </div>
      </div>
    </section>
  );
}

function PledgePreview() {
  const amountId = useId();
  const countdown = usePledgeCountdown(config.betaCloseDate);
  const [amount, setAmount] = useState(String(config.pledge.minimum));
  const [message, setMessage] = useState("");

  function handlePledge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      countdown.closed
        ? "The beta pledge window has closed. Thank you to everyone who took part."
        : "Pledge functionality is not yet available. No funds have been collected.",
    );
  }

  return (
    <section aria-labelledby="pledge-title" className="accuer-container py-[78px] sm:py-[104px]" id="beta">
      <div className="grid items-start gap-9 lg:grid-cols-[0.8fr_1fr] lg:gap-[94px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="accuer-section-label">04 — Be part of the beginning</p>
            <span className="rounded-full border border-secondary-ink/25 px-3 py-1 text-[9px] uppercase text-secondary-ink">
              Preview
            </span>
          </div>
          <h2 className="accuer-display mt-5 max-w-[460px] text-[41px] leading-[1.06] sm:text-[51px]" id="pledge-title">
            Beta pledges
          </h2>
          <p className="mt-4 max-w-[425px] text-[14px] leading-[1.85] text-secondary-ink">
            Pledge funds to support the Accuer beta. Pledging is available only while
            the beta is open.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-secondary-ink/15 bg-deep-cream">
              <Feather size={16} strokeWidth={1.7} />
            </span>
            <p className="max-w-[330px] text-[11px] leading-[1.7] text-muted-ink">
              This is a preview of a planned participation process, not a pledge request.
            </p>
          </div>
        </div>

        <GlassCard light className="!p-5 sm:!p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="accuer-section-label">Planned beta participation</p>
              <p className="mt-2 text-[13px] font-medium">Pledge window</p>
            </div>
            <span className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-ink/15 px-3 font-mono text-[9px] uppercase">
              <CircleDashed aria-hidden="true" size={11} /> Not active
            </span>
          </div>

          <form className="mt-6" onSubmit={handlePledge}>
            <label className="accuer-form-label" htmlFor={amountId}>Pledge amount · preview</label>
            <div className="relative">
              <input
                className="accuer-input !pr-[72px]"
                id={amountId}
                inputMode="decimal"
                max={config.pledge.maximum}
                min={config.pledge.minimum}
                type="number"
                step="50"
                required
                aria-describedby={`${amountId}-range`}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <span aria-hidden="true" className="accuer-mono pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-muted-ink">
                PREVIEW
              </span>
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-ink" id={`${amountId}-range`}>
              Preview range: {formatPreviewAmount(config.pledge.minimum)} – {formatPreviewAmount(config.pledge.maximum)} sample units
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-secondary-ink">
                {countdown.closed ? "Window closed" : countdown.label}
              </span>
              <Button className="min-h-[44px] gap-2 rounded-full bg-ink px-5 text-cream hover:bg-secondary-ink active:scale-[0.985]" type="submit">
                Pledge <ArrowRight aria-hidden="true" size={14} />
              </Button>
            </div>
            {message && <p aria-live="polite" className="mt-4 rounded-xl border border-ink/15 bg-deep-cream px-4 py-3 text-[12px] leading-[1.65] text-ink" role="status">{message}</p>}
          </form>

          <div className="mt-6 border-t border-ink/15 pt-5">
            <p className="accuer-section-label !text-[9px]">Example transaction statuses</p>
            <div aria-label="Preview of possible transaction statuses. No pledge has been submitted." className="mt-3 flex flex-wrap gap-2" role="group">
              {(["Pending", "Confirmed", "Failed"] as const).map((status, index) => (
                <span className={`accuer-pledge-status inline-flex min-h-[30px] items-center gap-1.5 px-3 text-[10px]${index === 0 ? " accuer-pledge-status--selected" : ""}`} key={status}>
                  {index === 0 ? <Radio aria-hidden="true" size={12} /> : index === 1 ? <Check aria-hidden="true" size={12} /> : <CircleHelp aria-hidden="true" size={12} />}
                  {status}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-5 flex items-start gap-2 text-[11px] leading-[1.8] text-secondary-ink">
            <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
            Pledge functionality is not yet active. This preview does not collect
            funds, connect a wallet or submit a transaction.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

function CommunityFeed({ events }: { readonly events: readonly PledgeEvent[] }) {
  if (events.length === 0) {
    return <p className="rounded-2xl border border-cream/20 px-5 py-7 text-[13px] text-cream/80">No sample activity to show yet.</p>;
  }

  return (
    <ol aria-label="Sample recent pledge activity" className="space-y-2.5">
      {events.map((event) => (
        <li className="accuer-feed-card flex min-w-0 items-center gap-3 px-4 py-3" key={event.address}>
          <span className="shrink-0"><GeometricAvatar address={event.address} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] text-cream/90">{formatAddress(event.address)}</p>
            <p className="mt-1 truncate text-[10px] text-cream/65">Sample contribution · {formatRelativeTime(event.minutesAgo)}</p>
          </div>
          <p className="accuer-mono shrink-0 text-[12px] text-cream sm:text-[13px]">
            {formatPreviewAmount(event.sampleAmount)}
            <span className="ml-1 text-[9px] text-cream/65">sample units</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

function CommunityPreview() {
  const [response, setResponse] = useState<DataAdapterResponse<PledgePreviewData>>({
    status: "loading",
    mode: config.mode,
  });

  useEffect(() => {
    let mounted = true;
    void communityAdapter.readCommunity()
      .then((result) => {
        if (mounted) setResponse(result);
      })
      .catch(() => {
        if (mounted) {
          setResponse({
            status: "error",
            mode: config.mode,
            message: "Preview community data could not be loaded.",
          });
        }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section aria-labelledby="community-title" className="accuer-container py-[77px] sm:py-[105px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="accuer-section-label">05 — Built in good company</p>
          <h2 className="accuer-display mt-4 text-[38px] leading-[1.1] sm:text-[47px]" id="community-title">
            A small market, a wider idea.
          </h2>
        </div>
        <p className="max-w-[330px] text-[12px] leading-[1.8] text-secondary-ink">
          An invented glimpse of the community we hope to build. Every amount and
          participant below is sample data.
        </p>
      </div>

      {response.status === "loading" ? (
        <div aria-live="polite" className="mt-7 min-h-[200px] animate-pulse rounded-[28px] border border-ink/10 bg-deep-cream" role="status">Loading preview community data…</div>
      ) : response.status === "error" ? (
        <div aria-live="assertive" className="mt-7 rounded-[28px] border border-ink/15 bg-light-cream px-6 py-8 text-[13px] text-secondary-ink" role="status">{response.message}</div>
      ) : response.status === "empty" ? (
        <div className="mt-7 rounded-[28px] border border-ink/15 bg-light-cream px-6 py-8 text-[13px] text-secondary-ink">The sample community has not shared activity yet.</div>
      ) : (
        <CommunityPanel data={response.data} />
      )}
    </section>
  );
}

function CommunityPanel({ data }: { readonly data: PledgePreviewData }) {
  const progress = Math.min(100, Math.max(0, Math.round((data.totalPledged / data.goal) * 100)));

  return (
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:gap-8">
      <div className="accuer-community-header px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="accuer-section-label">Beta community</p>
          <PreviewBadge />
        </div>
        <h3 className="accuer-display mt-8 text-[14px]">Total pledged</h3>
        <div aria-label={`${formatPreviewAmount(data.totalPledged)} sample units total pledged. Preview data, not a real balance.`} className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <p className="accuer-mono text-[39px] leading-[1.15] sm:text-[49px]">
            {formatPreviewAmount(data.totalPledged)}
            <span className="ml-2 text-[11px] text-secondary-ink">sample units</span>
          </p>
          <AvatarStack addresses={config.community.previewAddresses} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-[10px] text-secondary-ink">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="relative size-[7px] rounded-full bg-secondary-ink">
              <span className="absolute -inset-1 animate-ping rounded-full bg-secondary-ink/20 motion-reduce:animate-none" />
            </span>
            Sample snapshot
          </span>
          <span aria-hidden="true">·</span>
          <span>{data.pledgerCount} sample pledgers</span>
          <span aria-hidden="true">·</span>
          <span>{data.remainingInvites} sample invites remaining</span>
        </div>
        <div className="mt-7 border-t border-ink/15 pt-5">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span>Sample progress toward sample goal</span>
            <span className="accuer-mono">{progress}%</span>
          </div>
          <div
            aria-label={`${progress}% of the sample pledge goal. Preview only.`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="accuer-progress-track mt-3"
            role="progressbar"
          >
            <div className="accuer-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2.5 text-[10px] text-secondary-ink">
            {formatPreviewAmount(data.totalPledged)} of {formatPreviewAmount(data.goal)} sample units
          </p>
        </div>
      </div>

      <section aria-labelledby="community-feed-title" className="min-w-0 pt-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="accuer-section-label">A fictional snapshot</p>
            <h3 className="accuer-display mt-2 text-[23px]" id="community-feed-title">Recent pledges</h3>
          </div>
          <PreviewBadge className="border-ink/20" />
        </div>
        <p className="mb-4 text-[11px] leading-[1.75] text-secondary-ink">
          Illustrative activity only. These addresses and amounts are invented, not
          verified participants, financial transactions or blockchain data.
        </p>
        <CommunityFeed events={data.events} />
      </section>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "State your intent",
    description: "Describe the swap in plain language and Accuer’s agent interprets the request.",
    icon: Sparkles,
    width: "lg:ml-0 lg:mr-auto lg:max-w-[510px]",
  },
  {
    number: "02",
    title: "Simulate the routes",
    description: "The agent evaluates paths across tokenized asset pools and selects the best outcome.",
    icon: Waves,
    width: "lg:ml-auto lg:mr-[5%] lg:max-w-[545px]",
  },
  {
    number: "03",
    title: "Sign with quantum-resistant keys",
    description: "The chosen route is committed with a one-time hash-based signature.",
    icon: Fingerprint,
    width: "lg:ml-[5%] lg:mr-auto lg:max-w-[565px]",
  },
  {
    number: "04",
    title: "Enforce onchain",
    description: "A Uniswap v4 hook verifies the commitment before the swap executes and applies a dynamic fee.",
    icon: ShieldCheck,
    width: "lg:ml-auto lg:mr-0 lg:max-w-[510px]",
  },
] as const;

function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="border-y border-ink/10 bg-light-cream py-[77px] sm:py-[106px]" id="how-it-works">
      <div className="accuer-container">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="accuer-section-label">06 — From intent to enforcement</p>
            <h2 className="accuer-display mt-4 text-[39px] leading-[1.08] sm:text-[49px]" id="how-it-works-title">
              How Accuer works
            </h2>
          </div>
          <span className="inline-flex min-h-[29px] items-center gap-2 rounded-full border border-ink/15 px-3 text-[10px] text-secondary-ink">
            <CircleDashed aria-hidden="true" size={12} /> Intended architecture
          </span>
        </div>

        <div className="relative mt-9 lg:mt-14">
          <div aria-hidden="true" className="absolute bottom-5 left-[23px] top-5 hidden w-px bg-ink/15 sm:block" />
          <ol className="space-y-3 sm:space-y-4">
            {steps.map(({ number, title, description, icon: Icon, width }, index) => (
              <li className="relative flex min-w-0 items-start gap-4 sm:gap-7" key={number}>
                <span className="accuer-mono z-[1] mt-[17px] grid size-[46px] shrink-0 place-items-center rounded-full border border-ink/15 bg-light-cream text-[12px] text-secondary-ink sm:mt-5 sm:size-[47px]">
                  {number}
                </span>
                <article className={`accuer-timeline-card min-w-0 flex-1 border border-ink/10 bg-cream p-5 sm:p-6 lg:flex-none lg:w-[78%] ${width}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-deep-cream">
                        <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="accuer-section-label !text-[9px]">Step {number} · intended</p>
                        <h3 className="accuer-display mt-2 text-[19px] leading-[1.3] sm:text-[22px]">{title}</h3>
                      </div>
                    </div>
                    {index === 0 ? <MoveRight aria-hidden="true" className="mt-1 hidden text-muted-ink sm:block" size={15} /> : null}
                  </div>
                  <p className="mt-3 pl-0 text-[12px] leading-[1.8] text-secondary-ink sm:pl-12 sm:text-[13px]">
                    {description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-6 max-w-[740px] pl-[62px] text-[11px] leading-[1.8] text-muted-ink sm:pl-[75px]">
          These steps describe the intended protocol architecture. This preview
          simulates route discovery only; it does not implement agent signing,
          cryptographic verification or onchain execution.
        </p>
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "What is Accuer?",
    answer: "Accuer is an agentic swap router that uses quantum-resistant signatures and a Uniswap v4 hook to route trades in tokenized assets.",
  },
  {
    question: "Why quantum-resistant signatures?",
    answer: "Hash-based signatures are designed to resist attacks from quantum computers and can support verification workflows onchain.",
  },
  {
    question: "Who can join the beta?",
    answer: "Access is by invite code only.",
  },
  {
    question: "What happens to pledged funds?",
    answer: "The beta pledge functionality is not yet active, and this preview does not collect funds. Before real pledges open, the applicable contract, terms and handling of funds will be disclosed.",
  },
] as const;

function FrequentlyAskedQuestions() {
  return (
    <section aria-labelledby="faq-title" className="accuer-container py-[77px] sm:py-[102px]" id="faq">
      <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-[84px]">
        <div>
          <p className="accuer-section-label">07 — Common questions</p>
          <h2 className="accuer-display mt-4 text-[39px] leading-[1.08] sm:text-[48px]" id="faq-title">A few straight answers.</h2>
          <p className="mt-4 max-w-[310px] text-[13px] leading-[1.8] text-secondary-ink">
            The ambition is big. The things this beta actually does are intentionally small.
          </p>
        </div>
        <div>
          {faqItems.map(({ question, answer }) => (
            <details className="accuer-faq-item" key={question}>
              <summary>
                <span>{question}</span>
                <Plus aria-hidden="true" size={16} />
              </summary>
              <div className="accuer-faq-content">
                <div className="accuer-faq-answer">
                  <p>{answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingNotice() {
  const hasX = Boolean(config.socialLinks.x);
  const hasTelegram = Boolean(config.socialLinks.telegram);

  return (
    <footer className="accuer-ink-panel accuer-footer mx-auto mt-3 w-full px-4 sm:px-8">
      <div className="accuer-container py-[53px] sm:py-[71px]">
        <div className="grid items-start gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-[85px]">
          <div>
            <p className="accuer-section-label accruer-section-label--light">A considered beginning</p>
            <h2 className="accuer-display mt-4 text-[34px] leading-[1.1] sm:text-[43px]">Built to make room for better routes.</h2>
          </div>
          <div className="rounded-[21px] border border-cream/20 bg-cream/[0.055] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Shield aria-hidden="true" size={16} />
              <h3 className="accuer-display text-[17px]">Risk notice</h3>
            </div>
            <p className="mt-4 text-[12px] leading-[1.9] text-cream/85">
              Accuer is beta software and has not completed a formal security audit.
              Route previews are simulated, and pledge functionality is not yet active.
              Do not interpret this website as confirmation that a transaction has
              been signed, verified or executed.
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-5 border-t border-cream/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <HomeLogo />
          <nav aria-label="Social links" className="flex flex-wrap items-center gap-5">
            {hasX && (
              <a className="inline-flex min-h-10 items-center gap-1.5 text-[12px] text-cream/85 hover:text-cream focus-visible:rounded-sm" href={config.socialLinks.x} rel="noreferrer noopener" target="_blank">
                X <ExternalLink aria-hidden="true" size={11} />
              </a>
            )}
            {hasTelegram && (
              <a className="inline-flex min-h-10 items-center gap-1.5 text-[12px] text-cream/85 hover:text-cream focus-visible:rounded-sm" href={config.socialLinks.telegram} rel="noreferrer noopener" target="_blank">
                Telegram <ExternalLink aria-hidden="true" size={11} />
              </a>
            )}
            {!hasX && !hasTelegram && (
              <span className="text-[11px] text-cream/65">Community links will appear when announced.</span>
            )}
          </nav>
          <p className="accuer-mono text-[10px] text-cream/65">© Accuer {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

function AuthenticatedBeta() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (restoreBetaAccess(config.invite.sessionKey)) setUnlocked(true);
  }, []);

  function returnToInvite() {
    document.getElementById("invite")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <InviteGate onUnlock={() => setUnlocked(true)} />
      {unlocked && (
        <div aria-label="Private beta access granted" className="accuer-unlocked" id="beta-experience">
          <RoutePreview onReturn={returnToInvite} />
          {config.features.pledgePreview && <PledgePreview />}
          {config.features.communityPreview && <CommunityPreview />}
        </div>
      )}
    </>
  );
}

export function AccuerPage() {
  return (
    <main className="accuer-page min-h-screen">
      <Navigation />
      <Hero />
      <AuthenticatedBeta />
      <HowItWorks />
      <FrequentlyAskedQuestions />
      <ClosingNotice />
    </main>
  );
}

export const heroIllustrationName = "Accuer simulated route preview";