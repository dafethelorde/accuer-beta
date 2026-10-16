import type { DataMode, PledgeEvent } from "@/config";

export interface PledgePreviewData {
  readonly totalPledged: number;
  readonly pledgerCount: number;
  readonly remainingInvites: number;
  readonly goal: number;
  readonly events: readonly PledgeEvent[];
}

export type DataAdapterResponse<T> =
  | { readonly status: "loading"; readonly mode: DataMode }
  | { readonly status: "success"; readonly mode: DataMode; readonly data: T }
  | { readonly status: "empty"; readonly mode: DataMode }
  | { readonly status: "error"; readonly mode: DataMode; readonly message: string };

export interface CommunityDataAdapter {
  readCommunity(): Promise<DataAdapterResponse<PledgePreviewData>>;
}

export interface PreviewCommunityConfiguration {
  readonly mode: DataMode;
  readonly community: PledgePreviewData;
}

export function createCommunityDataAdapter(
  configuration: PreviewCommunityConfiguration,
): CommunityDataAdapter {
  return {
    async readCommunity() {
      if (configuration.mode !== "PREVIEW") {
        return {
          status: "error",
          mode: configuration.mode,
          message: "Live pledge data is not configured. Preview data remains private to preview mode.",
        };
      }

      const { community } = configuration;
      const hasValidMetrics =
        Number.isFinite(community.goal) &&
        community.goal > 0 &&
        Number.isFinite(community.totalPledged) &&
        community.totalPledged >= 0 &&
        Number.isFinite(community.pledgerCount) &&
        community.pledgerCount >= 0 &&
        Number.isFinite(community.remainingInvites) &&
        community.remainingInvites >= 0;

      if (!hasValidMetrics) {
        return {
          status: "error",
          mode: configuration.mode,
          message: "Preview community data is unavailable. Please try again later.",
        };
      }

      if (community.events.length === 0 && community.pledgerCount === 0) {
        return { status: "empty", mode: configuration.mode };
      }

      return { status: "success", mode: configuration.mode, data: community };
    },
  };
}