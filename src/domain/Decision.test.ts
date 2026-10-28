import { describe, it, expect } from "vitest";
import { Decision } from "./Decision";

const lead = { id: "u2", role: "lead" as const };

const make = (id = "d1") =>
  Decision.propose({
    id,
    title: "Use Postgres",
    reason: "Need transactions",
    authorId: "u1",
  });

const approved = (id = "d1") => {
  const d = make(id);
  d.approve(lead);
  return d;
};

describe("Decision", () => {
  it("starts as proposed", () => {
    expect(make().status).toBe("proposed");
  });

  it("lets a lead approve", () => {
    expect(approved().status).toBe("approved");
  });

  it("blocks self-approval", () => {
    expect(() => make().approve({ id: "u1", role: "lead" })).toThrow();
  });

  it("blocks non-leads", () => {
    expect(() => make().approve({ id: "u3", role: "member" })).toThrow();
  });

  it("cannot be reviewed twice", () => {
    const d = approved();
    expect(() => d.reject(lead)).toThrow("already reviewed");
  });

  it("cannot supersede a proposed decision", () => {
    expect(() => make("d1").supersede(approved("d2"))).toThrow(
      "Only approved decisions can be superseded",
    );
  });

  it("can supersede an approved decision with an approved one", () => {
    const old = approved("d1");
    old.supersede(approved("d2"));
    expect(old.status).toBe("superseded");
    expect(old.supersededBy).toBe("d2");
  });

  it("rejects a replacement that is not approved", () => {
    const old = approved("d1");
    expect(() => old.supersede(make("d2"))).toThrow("Replacement must be approved");
    expect(old.status).toBe("approved"); // unchanged after the failure
  });

  it("cannot supersede itself", () => {
    const d = approved("d1");
    expect(() => d.supersede(d)).toThrow("cannot supersede itself");
  });
});
