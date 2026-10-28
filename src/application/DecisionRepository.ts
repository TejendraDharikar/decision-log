import { Decision, DecisionStatus } from "@/domain/Decision";

export interface DecisionRepository {
  save(decision: Decision): Promise<void>;
  findById(id: string): Promise<Decision | null>;
  list(filter?: { status?: DecisionStatus }): Promise<Decision[]>;
}
