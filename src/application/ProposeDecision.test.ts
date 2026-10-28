// src/application/ProposeDecision.test.ts
import { describe, it, expect } from "vitest";
import { ProposeDecision } from "./ProposeDecision";
import { InMemoryDecisionRepository } from "@/test-support/InMemmoryDecisionRepository";

describe("ProposeDecision", () => {
  it("saves a proposed decision", async () => {
    const repo = new InMemoryDecisionRepository();
    const useCase = new ProposeDecision(repo);

    const result = await useCase.execute({
      title: "Use Redis for sessions",
      reason: "Fast reads and key expiry",
      authorId: "u1",
    });

    const saved = await repo.findById(result.decisionId);
    expect(saved?.status).toBe("proposed");
    expect(saved?.title).toBe("Use Redis for sessions");
  });

  it("rejects an empty title and saves nothing", async () => {
    const repo = new InMemoryDecisionRepository();
    const useCase = new ProposeDecision(repo);

    await expect(useCase.execute({ title: "", reason: "x", authorId: "u1" })).rejects.toThrow();

    expect(await repo.list()).toHaveLength(0);
  });
});
