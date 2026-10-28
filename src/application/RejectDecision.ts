import { DecisionRepository } from "./DecisionRepository";
import { NotFoundError } from "./errors";
import { MemberRepository } from "./MemberRepository";

export class RejectDecision {
  constructor(
    private decisions: DecisionRepository,
    private members: MemberRepository,
  ) {}

  async execute(input: { decisionId: string; reviewerId: string }) {
    const decision = await this.decisions.findById(input.decisionId);
    if (!decision) throw new NotFoundError("Decision", input.decisionId);

    const reviewer = await this.members.findById(input.reviewerId);
    if (!reviewer) throw new NotFoundError("Member", input.reviewerId);

    decision.reject(reviewer);
    await this.decisions.save(decision);

    return { decisionId: decision.id, status: decision.status };
  }
}
