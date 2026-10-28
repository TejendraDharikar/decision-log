import { DecisionRepository } from "./DecisionRepository";
import { NotFoundError } from "./errors";
import { IncidentRepository } from "./IncidentRepository";

export class GetDecision {
  constructor(
    private decisions: DecisionRepository,
    private incidents: IncidentRepository,
  ) {}

  async execute(input: { decisionId: string }) {
    const decision = await this.decisions.findById(input.decisionId);
    if (!decision) throw new NotFoundError("Decision", input.decisionId);

    const linked = await this.incidents.findByDecisionId(decision.id);

    return {
      id: decision.id,
      title: decision.title,
      reason: decision.reason,
      authorId: decision.authorId,
      status: decision.status,
      supersededBy: decision.supersededBy,
      incidents: linked.map((i) => ({
        id: i.id,
        title: i.title,
        severity: i.severity,
        status: i.status,
      })),
    };
  }
}
