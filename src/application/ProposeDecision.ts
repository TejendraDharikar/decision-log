import { Decision } from "@/domain/Decision";
import { DecisionRepository } from "./DecisionRepository";

export class ProposeDecision {
  constructor(private decisions: DecisionRepository) {}

  async execute(input: { title: string; reason: string; authorId: string }) {
    const decision = Decision.propose({ id: crypto.randomUUID(), ...input });
    await this.decisions.save(decision);
    return { decisionId: decision.id, status: decision.status };
  }
}
