// src/test-support/decisionRepositoryContract.ts
import { describe, it, expect, beforeEach } from "vitest";
import { Decision } from "@/domain/Decision";
import { DecisionRepository } from "@/application/DecisionRepository";

const lead = { id: "u2", role: "lead" as const };
const make = (id: string) =>
  Decision.propose({
    id,
    title: `Title ${id}`,
    reason: "Because",
    authorId: "u1",
  });

export function decisionRepositoryContract(
  name: string,
  create: () => Promise<DecisionRepository>,
) {
  describe(`DecisionRepository contract: ${name}`, () => {
    let repo: DecisionRepository;

    beforeEach(async () => {
      repo = await create();
    });

    it("returns null for an unknown id", async () => {
      expect(await repo.findById("nope")).toBeNull();
    });

    it("saves and loads a decision", async () => {
      await repo.save(make("d1"));
      const loaded = await repo.findById("d1");
      expect(loaded?.title).toBe("Title d1");
      expect(loaded?.status).toBe("proposed");
    });

    it("keeps status changes after saving again", async () => {
      const d = make("d1");
      await repo.save(d);
      d.approve(lead);
      await repo.save(d);
      expect((await repo.findById("d1"))?.status).toBe("approved");
    });

    it("keeps supersededBy", async () => {
      const old = make("d1");
      const next = make("d2");
      old.approve(lead);
      next.approve(lead);
      old.supersede(next);
      await repo.save(old);
      const loaded = await repo.findById("d1");
      expect(loaded?.status).toBe("superseded");
      expect(loaded?.supersededBy).toBe("d2");
    });

    it("lists everything, or filters by status", async () => {
      const a = make("d1");
      const b = make("d2");
      b.approve(lead);
      await repo.save(a);
      await repo.save(b);

      expect(await repo.list()).toHaveLength(2);
      const approved = await repo.list({ status: "approved" });
      expect(approved).toHaveLength(1);
      expect(approved[0].id).toBe("d2");
    });
  });
}
