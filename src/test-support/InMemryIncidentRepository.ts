// src/test-support/InMemoryIncidentRepository.ts
import { Incident } from "@/domain/Incident";
import { IncidentRepository } from "@/application/IncidentRepository";

export class InMemoryIncidentRepository implements IncidentRepository {
  private items = new Map<string, Incident>();

  async save(i: Incident) {
    this.items.set(i.id, i);
  }
  async findById(id: string) {
    return this.items.get(id) ?? null;
  }
  async findByDecisionId(decisionId: string) {
    return [...this.items.values()].filter((i) => i.decisionId === decisionId);
  }
}
