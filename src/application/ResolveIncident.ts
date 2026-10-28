import { NotFoundError } from "./errors";
import { IncidentRepository } from "./IncidentRepository";

export class ResolveIncident {
  constructor(private incidents: IncidentRepository) {}

  async execute(input: { incidentId: string }) {
    const incident = await this.incidents.findById(input.incidentId);
    if (!incident) throw new NotFoundError("Incident", input.incidentId);

    incident.resolve();
    await this.incidents.save(incident);

    return { incidentId: incident.id, status: incident.status };
  }
}
