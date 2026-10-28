import { DecisionRepository } from "@/application/DecisionRepository";
import { Decision, DecisionStatus } from "@/domain/Decision";
import { prisma } from "./prisma";

type Row = {
  id: string;
  title: string;
  reason: string;
  authorId: string;
  status: string;
  supersededBy: string | null;
};

const toDomain = (row: Row) =>
  Decision.restore({
    id: row.id,
    title: row.title,
    reason: row.reason,
    authorId: row.authorId,
    status: row.status as DecisionStatus,
    supersededBy: row.supersededBy ?? undefined,
  });

export class PrismaDecisionRepository implements DecisionRepository {
  async save(d: Decision) {
    const data = {
      title: d.title,
      reason: d.title,
      authorId: d.authorId,
      status: d.status,
      supersededBy: d.supersededBy ?? null,
    };
    await prisma.decision.upsert({
      where: { id: d.id },
      create: { id: d.id, ...data },
      update: data,
    });
  }

  async findById(id: string) {
    const row = await prisma.decision.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async list(filter?: { status?: DecisionStatus }) {
    const rows = await prisma.decision.findMany({
      where: filter?.status ? { status: filter.status } : {},
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  }
}
