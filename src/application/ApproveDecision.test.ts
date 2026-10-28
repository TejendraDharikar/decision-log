// src/application/ApproveDecision.test.ts
import { describe, it, expect } from "vitest";
import { Decision } from "@/domain/Decision";
import { ApproveDecision } from "./ApproveDecision";
import { NotFoundError } from "./errors";
import { InMemoryMemberRepository } from "@/test-support/InMemoryMemberRepository";
import { InMemoryDecisionRepository } from "@/test-support/InMemmoryDecisionRepository";

async function setup() {
  const decisions = new InMemoryDecisionRepository();
  const members = new InMemoryMemberRepository([
    { id: "u1", role: "lead" }, // the author, also a lead
    { id: "u2", role: "lead" },
    { id: "u3", role: "member" },
  ]);

  const decision = Decision.propose({
    id: "d1",
    title: "Use Redis",
    reason: "Fast reads",
    authorId: "u1",
  });
  await decisions.save(decision);

  return { decisions, useCase: new ApproveDecision(decisions, members) };
}

describe("ApproveDecision", () => {
  it("lets a lead approve and saves the result", async () => {
    const { decisions, useCase } = await setup();

    const result = await useCase.execute({
      decisionId: "d1",
      reviewerId: "u2",
    });

    expect(result.status).toBe("approved");
    expect((await decisions.findById("d1"))?.status).toBe("approved");
  });

  it("throws NotFoundError for an unknown decision", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ decisionId: "nope", reviewerId: "u2" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("throws NotFoundError for an unknown reviewer", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ decisionId: "d1", reviewerId: "nope" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("blocks a non-lead and leaves the decision proposed", async () => {
    const { decisions, useCase } = await setup();

    await expect(useCase.execute({ decisionId: "d1", reviewerId: "u3" })).rejects.toThrow();

    expect((await decisions.findById("d1"))?.status).toBe("proposed");
  });

  it("blocks the author from approving their own decision", async () => {
    const { useCase } = await setup();
    await expect(useCase.execute({ decisionId: "d1", reviewerId: "u1" })).rejects.toThrow();
  });
});
