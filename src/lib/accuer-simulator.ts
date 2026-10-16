export interface RouteHop {
  readonly poolName: string;
  readonly expectedOutput: number;
  readonly feeBps: number;
  readonly priceImpactBps: number;
}

export interface RouteStage {
  readonly id: "intent-parsed" | "routes-simulated" | "route-signed" | "hook-verified";
  readonly label: string;
  readonly progress: 25 | 50 | 75 | 100;
  readonly description: string;
}

export interface RouteData {
  readonly intent: string;
  readonly stages: readonly RouteStage[];
  readonly hops: readonly RouteHop[];
  readonly selectedRoute: {
    readonly name: string;
    readonly expectedOutput: number;
  };
  readonly directPool: {
    readonly name: string;
    readonly expectedOutput: number;
  };
  readonly simulatedSavingsBps: number;
  readonly commitmentHash: string;
  readonly oneTimeKeyIndex: number;
  readonly status: "SIMULATED";
}

const stages: readonly RouteStage[] = [
  { id: "intent-parsed", label: "Intent parsed", progress: 25, description: "Swap intent prepared" },
  { id: "routes-simulated", label: "Routes simulated", progress: 50, description: "Sample pool paths compared" },
  { id: "route-signed", label: "Route signed", progress: 75, description: "Signature is not generated in preview" },
  { id: "hook-verified", label: "Hook verified", progress: 100, description: "Onchain verification is not performed" },
];

export interface RouteSimulationResponse {
  readonly mode: "PREVIEW";
  readonly data: RouteData;
}

function createCommitment(): string {
  const alphabet = "0123456789abcdef";
  const random = new Uint8Array(32);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(random);
  return `0x${Array.from(random, (byte, index) => alphabet[(byte + index * 3) % alphabet.length]).join("")}`;
}

export async function simulateRoute(intent: string): Promise<RouteSimulationResponse> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 460));

  const routeOutput = 2984.2;
  const directOutput = 2978.2;

  return {
    mode: "PREVIEW",
    data: {
      intent: intent.trim(),
      stages,
      hops: [
        { poolName: "Tokenized bills · A", expectedOutput: 1499.85, feeBps: 5, priceImpactBps: 9 },
        { poolName: "Treasury index · B", expectedOutput: 2984.2, feeBps: 3, priceImpactBps: 7 },
      ],
      selectedRoute: { name: "Accuer multi-hop · sample", expectedOutput: routeOutput },
      directPool: { name: "Direct pool · sample", expectedOutput: directOutput },
      simulatedSavingsBps: Math.round(((routeOutput - directOutput) / directOutput) * 10000),
      commitmentHash: createCommitment(),
      oneTimeKeyIndex: 1842,
      status: "SIMULATED",
    },
  };
}