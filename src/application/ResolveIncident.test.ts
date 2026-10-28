// src/application/ResolveIncident.test.ts
import { describe, it, expect } from "vitest";
import { Decision } from "@/domain/Decision";
import { OpenIncident } from "./OpenIncident";
import { LinkIncidentToDecision } from "./LinkIncidentToDecision";
import { ResolveIncident } from "./ResolveIncident";
import { NotFoundError } from "./errors";
import { InMemoryIncidentRepository } from "@/test-support/InMemryIncidentRepository";
import { InMemoryDecisionRepository } from "@/test-support/InMemmoryDecisionRepository";

describe("incident flow", () => {
  it("requires a linked decision before resolving a high severity incident", async () => {
    const incidents = new InMemoryIncidentRepository();
    const decisions = new InMemoryDecisionRepository();
    await decisions.save(
      Decision.propose({
        id: "d1",
        title: "Use Redis",
        reason: "Fast",
        authorId: "u1",
      }),
    );

    const { incidentId } = await new OpenIncident(incidents).execute({
      title: "Sessions logging out",
      severity: "high",
    });

    const resolve = new ResolveIncident(incidents);
    await expect(resolve.execute({ incidentId })).rejects.toThrow();

    await new LinkIncidentToDecision(incidents, decisions).execute({
      incidentId,
      decisionId: "d1",
    });

    const result = await resolve.execute({ incidentId });
    expect(result.status).toBe("resolved");
  });

  it("cannot link to a decision that does not exist", async () => {
    const incidents = new InMemoryIncidentRepository();
    const decisions = new InMemoryDecisionRepository();
    const { incidentId } = await new OpenIncident(incidents).execute({
      title: "Slow login",
      severity: "low",
    });

    await expect(
      new LinkIncidentToDecision(incidents, decisions).execute({
        incidentId,
        decisionId: "nope",
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
