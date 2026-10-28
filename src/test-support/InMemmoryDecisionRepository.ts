// src/test-support/InMemoryDecisionRepository.ts
import { Decision, DecisionStatus } from "@/domain/Decision";
import { DecisionRepository } from "@/application/DecisionRepository";

export class InMemoryDecisionRepository implements DecisionRepository {
  private items = new Map<string, Decision>();

  async save(d: Decision) {
    this.items.set(d.id, d);
  }
  async findById(id: string) {
    return this.items.get(id) ?? null;
  }
  async list(filter?: { status?: DecisionStatus }) {
    const all = [...this.items.values()];
    return filter?.status ? all.filter((d) => d.status === filter.status) : all;
  }
}
