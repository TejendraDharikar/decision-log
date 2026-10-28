import { DecisionRepository } from "./DecisionRepository";
import { NotFoundError } from "./errors";
import { IncidentRepository } from "./IncidentRepository";

export class LinkIncidentToDecision {
  constructor(
    private incidents: IncidentRepository,
    private decisions: DecisionRepository,
  ) {}

  async execute(input: { incidentId: string; decisionId: string }) {
    const incident = await this.incidents.findById(input.incidentId);
    if (!incident) throw new NotFoundError("Incident", input.incidentId);

    const decision = await this.decisions.findById(input.decisionId);
    if (!decision) throw new NotFoundError("Decision", input.decisionId);

    incident.linkDecision(decision.id);
    await this.incidents.save(incident);

    return { incidentId: incident.id, decisionId: decision.id };
  }
}
