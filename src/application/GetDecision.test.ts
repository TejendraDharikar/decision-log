// src/application/GetDecision.test.ts
import { describe, it, expect } from "vitest";
import { Decision } from "@/domain/Decision";
import { Incident } from "@/domain/Incident";
import { GetDecision } from "./GetDecision";
import { NotFoundError } from "./errors";
import { InMemoryDecisionRepository } from "@/test-support/InMemmoryDecisionRepository";
import { InMemoryIncidentRepository } from "@/test-support/InMemryIncidentRepository";
import { ListDEcisions } from "./ListDecisions";

const lead = { id: "u2", role: "lead" as const };

describe("GetDecision", () => {
  it("returns the decision with only its own linked incidents", async () => {
    const decisions = new InMemoryDecisionRepository();
    const incidents = new InMemoryIncidentRepository();

    await decisions.save(
      Decision.propose({
        id: "d1",
        title: "Use Redis",
        reason: "Fast",
        authorId: "u1",
      }),
    );

    const linked = Incident.open({
      id: "i1",
      title: "Logouts",
      severity: "high",
    });
    linked.linkDecision("d1");
    await incidents.save(linked);

    const unrelated = Incident.open({
      id: "i2",
      title: "Typo",
      severity: "low",
    });
    await incidents.save(unrelated);

    const result = await new GetDecision(decisions, incidents).execute({
      decisionId: "d1",
    });

    expect(result.title).toBe("Use Redis");
    expect(result.incidents).toHaveLength(1);
    expect(result.incidents[0].id).toBe("i1");
  });

  it("throws NotFoundError for an unknown decision", async () => {
    const useCase = new GetDecision(
      new InMemoryDecisionRepository(),
      new InMemoryIncidentRepository(),
    );
    await expect(useCase.execute({ decisionId: "nope" })).rejects.toThrow(NotFoundError);
  });
});

describe("ListDecisions", () => {
  it("returns everything, or filters by status", async () => {
    const decisions = new InMemoryDecisionRepository();

    const a = Decision.propose({
      id: "d1",
      title: "A",
      reason: "r",
      authorId: "u1",
    });
    const b = Decision.propose({
      id: "d2",
      title: "B",
      reason: "r",
      authorId: "u1",
    });
    b.approve(lead);
    await decisions.save(a);
    await decisions.save(b);

    const useCase = new ListDEcisions(decisions);

    expect(await useCase.execute()).toHaveLength(2);

    const approved = await useCase.execute({ status: "approved" });
    expect(approved).toHaveLength(1);
    expect(approved[0].id).toBe("d2");
  });
});
