// src/domain/Incident.test.ts
import { describe, it, expect } from "vitest";
import { Incident } from "./Incident";

const make = (severity: "low" | "medium" | "high" = "low") =>
  Incident.open({ id: "i1", title: "Login slow", severity });

describe("Incident", () => {
  it("starts open", () => {
    expect(make().status).toBe("open");
  });

  it("requires a title", () => {
    expect(() => Incident.open({ id: "i1", title: " ", severity: "low" })).toThrow();
  });

  it("resolves a low severity incident without a decision", () => {
    const i = make("low");
    i.resolve();
    expect(i.status).toBe("resolved");
  });

  it("blocks resolving a high severity incident with no linked decision", () => {
    expect(() => make("high").resolve()).toThrow();
  });

  it("resolves a high severity incident once a decision is linked", () => {
    const i = make("high");
    i.linkDecision("d1");
    i.resolve();
    expect(i.status).toBe("resolved");
  });

  it("cannot be resolved twice", () => {
    const i = make();
    i.resolve();
    expect(() => i.resolve()).toThrow();
  });

  it("cannot be linked after resolving", () => {
    const i = make();
    i.resolve();
    expect(() => i.linkDecision("d1")).toThrow();
  });
});
