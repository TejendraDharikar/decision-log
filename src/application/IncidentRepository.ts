import { Incident } from "@/domain/Incident";

export interface IncidentRepository {
  save(incident: Incident): Promise<void>;
  findById(id: string): Promise<Incident | null>;
  findByDecisionId(decisionId: string): Promise<Incident[]>;
}
