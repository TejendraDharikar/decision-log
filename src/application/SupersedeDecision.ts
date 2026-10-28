import { DecisionRepository } from "./DecisionRepository";
import { NotFoundError } from "./errors";

export class SupersedeDecision {
  constructor(private decisions: DecisionRepository) {}

  async execute(input: { oldDecisionId: string; newDecisionId: string }) {
    const oldDecision = await this.decisions.findById(input.oldDecisionId);
    if (!oldDecision) throw new NotFoundError("oldDecision", input.oldDecisionId);

    const newDecision = await this.decisions.findById(input.newDecisionId);
    if (!newDecision) throw new NotFoundError("newDecision", input.newDecisionId);

    oldDecision.supersede(newDecision);
    await this.decisions.save(oldDecision);
    return {
      oldDecisionId: oldDecision.id,
      status: oldDecision.status,
      supersededBy: newDecision.id,
    };
  }
}
