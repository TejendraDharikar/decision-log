import { ApproveDecision } from "./application/ApproveDecision";
import { GetDecision } from "./application/GetDecision";
import { LinkIncidentToDecision } from "./application/LinkIncidentToDecision";
import { ListDecisions } from "./application/ListDecisions";
import { OpenIncident } from "./application/OpenIncident";
import { ProposeDecision } from "./application/ProposeDecision";
import { RejectDecision } from "./application/RejectDecision";
import { ResolveIncident } from "./application/ResolveIncident";
import { SupersedeDecision } from "./application/SupersedeDecision";
import { PrismaDecisionRepository } from "./infrastructure/PrismaDecisionRepository";
import { PrismaIncidentRepository } from "./infrastructure/PrismaIncidentRepository";
import { PrismaMemberRepository } from "./infrastructure/PrismaMemberRepository";

const decisions = new PrismaDecisionRepository();
const incidents = new PrismaIncidentRepository();
const members = new PrismaMemberRepository();

export const useCases = {
  proposeDecision: new ProposeDecision(decisions),
  approveDecision: new ApproveDecision(decisions, members),
  rejectDecision: new RejectDecision(decisions, members),
  supersedeDecision: new SupersedeDecision(decisions),
  getDecision: new GetDecision(decisions, incidents),
  listDecisions: new ListDecisions(decisions),
  openIncident: new OpenIncident(incidents),
  linkIncidentToDecision: new LinkIncidentToDecision(incidents, decisions),
  resolveIncident: new ResolveIncident(incidents),
};
