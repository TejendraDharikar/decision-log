import { IncidentRepository } from "@/application/IncidentRepository";
import { Incident, IncidentStatus, Severity } from "@/domain/Incident";
import { prisma } from "./prisma";

type Row = {
  id: string;
  title: string;
  severity: string;
  status: string;
  decisionId: string | null;
};

const toDomain = (row: Row) =>
  Incident.restore({
    id: row.id,
    title: row.title,
    severity: row.severity as Severity,
    status: row.status as IncidentStatus,
    decisionId: row.decisionId ?? undefined,
  });

export class PrismaIncidentRepository implements IncidentRepository {
  async save(i: Incident) {
    const data = {
      title: i.title,
      severity: i.severity,
      status: i.status,
      decisionId: i.decisionId ?? null,
    };
    await prisma.incident.upsert({
      where: { id: i.id },
      create: { id: i.id, ...data },
      update: data,
    });
  }

  async findById(id: string) {
    const row = await prisma.incident.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByDecisionId(decisionId: string) {
    const rows = await prisma.incident.findMany({
      where: { decisionId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  }
}
