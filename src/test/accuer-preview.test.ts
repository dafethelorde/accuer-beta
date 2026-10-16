import { describe, expect, it } from "vitest";

import { config } from "@/config";
import { createCommunityDataAdapter } from "@/lib/accuer-data-adapter";
import { simulateRoute } from "@/lib/accuer-simulator";

describe("Accuer's invite-only preview", () => {
  it("ships with an invite gate and preview-only data", () => {
    expect(config.features.inviteGate).toBe(true);
    expect(config.mode).toBe("PREVIEW");
    expect(config.invite.sha256Hashes.every((hash) => /^[a-f\d]{64}$/i.test(hash))).toBe(true);
  });

  it("returns simulated route data with four clear implementation stages", async () => {
    const response = await simulateRoute("  preview intent  ");

    expect(response.mode).toBe("PREVIEW");
    expect(response.data.intent).toBe("preview intent");
    expect(response.data.status).toBe("SIMULATED");
    expect(response.data.stages.map((stage) => stage.progress)).toEqual([25, 50, 75, 100]);
    expect(response.data.hops.length).toBeGreaterThan(0);
    expect(response.data.commitmentHash).toMatch(/^0x[a-f\d]{64}$/);
    expect(response.data.selectedRoute.expectedOutput).toBeGreaterThan(
      response.data.directPool.expectedOutput,
    );
  });

  it("returns clearly labelled sample community data without a live connection", async () => {
    const adapter = createCommunityDataAdapter({
      mode: config.mode,
      community: {
        goal: config.community.sampleGoal,
        totalPledged: config.community.sampleTotal,
        pledgerCount: config.community.samplePledgerCount,
        remainingInvites: config.community.sampleRemainingInvites,
        events: config.community.sampleEvents,
      },
    });
    const response = await adapter.readCommunity();

    expect(response.status).toBe("success");
    if (response.status === "success") {
      expect(response.mode).toBe("PREVIEW");
      expect(response.data.totalPledged).toBe(config.community.sampleTotal);
      expect(response.data.events).toHaveLength(config.community.sampleEvents.length);
    }
  });
});