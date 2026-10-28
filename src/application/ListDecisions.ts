import { DecisionStatus } from "@/domain/Decision";
import { DecisionRepository } from "./DecisionRepository";

export class ListDecisions {
  constructor(private decisions: DecisionRepository) {}

  async execute(input: { status?: DecisionStatus } = {}) {
    const decisions = await this.decisions.list({ status: input.status });

    return decisions.map((d) => ({
      id: d.id,
      title: d.title,
      status: d.status,
    }));
  }
}
