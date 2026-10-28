import { Incident, Severity } from "@/domain/Incident";
import { IncidentRepository } from "./IncidentRepository";

export class OpenIncident {
  constructor(private incidents: IncidentRepository) {}

  async execute(input: { title: string; severity: Severity }) {
    const incident = Incident.open({ id: crypto.randomUUID(), ...input });
    await this.incidents.save(incident);
    return { incidentId: incident.id, status: incident.status };
  }
}
