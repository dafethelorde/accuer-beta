export type DataMode = "PREVIEW" | "LIVE";

export interface InviteConfiguration {
  readonly sha256Hashes: readonly string[];
  readonly sessionKey: string;
  readonly redeemedPrefix: string;
}

export interface PledgeEvent {
  readonly address: string;
  readonly sampleAmount: number;
  readonly minutesAgo: number;
}

export interface ApplicationConfiguration {
  readonly productName: string;
  readonly mode: DataMode;
  readonly features: {
    readonly inviteGate: boolean;
    readonly routeSimulation: boolean;
    readonly communityPreview: boolean;
    readonly pledgePreview: boolean;
  };
  readonly invite: InviteConfiguration;
  readonly betaCloseDate: string;
  readonly pledge: {
    readonly minimum: number;
    readonly maximum: number;
  };
  readonly community: {
    readonly sampleGoal: number;
    readonly sampleTotal: number;
    readonly samplePledgerCount: number;
    readonly sampleRemainingInvites: number;
    readonly previewAddresses: readonly string[];
    readonly sampleEvents: readonly PledgeEvent[];
  };
  readonly socialLinks: {
    readonly x?: string;
    readonly telegram?: string;
  };
}

// Only browser-side SHA-256 digests belong here; never commit an invitation code.
export const config: ApplicationConfiguration = {
  productName: "Accuer",
  mode: "PREVIEW",
  features: {
    inviteGate: true,
    routeSimulation: true,
    communityPreview: true,
    pledgePreview: true,
  },
  invite: {
    sha256Hashes: ["b392a5266b2ef0bb68c8338482c103709da1b086e7306846db2b0ce0e3904817"],
    sessionKey: "accuer-beta-preview-v1",
    redeemedPrefix: "accuer-beta-redeemed-v1:",
  },
  betaCloseDate: "2026-12-31T23:59:59Z",
  pledge: {
    minimum: 250,
    maximum: 10000,
  },
  community: {
    sampleGoal: 200000,
    sampleTotal: 128450,
    samplePledgerCount: 128,
    sampleRemainingInvites: 42,
    previewAddresses: [
      "0x8f3a21c4d761ba059e447120ac96d382f1e5b60d",
      "0x2c91eb760fe4a8321579d6104b3a8f2c6d05e941",
      "0xa6450d9732f18c690bde452a761e0938f5c241b0",
      "0x713db58a40e629c7f13408abf6912e5d3c8a70f2",
      "0xe04f76b129c83a650adf4217b93e608c2f5a194d",
    ],
    sampleEvents: [
      { address: "0x8f3a21c4d761ba059e447120ac96d382f1e5b60d", sampleAmount: 4200, minutesAgo: 4 },
      { address: "0x2c91eb760fe4a8321579d6104b3a8f2c6d05e941", sampleAmount: 1800, minutesAgo: 19 },
      { address: "0xa6450d9732f18c690bde452a761e0938f5c241b0", sampleAmount: 7500, minutesAgo: 47 },
      { address: "0x713db58a40e629c7f13408abf6912e5d3c8a70f2", sampleAmount: 3250, minutesAgo: 86 },
    ],
  },
  socialLinks: {},
};