import { MemberRepository } from "@/application/MemberRepository";
import { Role } from "@/domain/Decision";
import { prisma } from "./prisma";

export class PrismaMemberRepository implements MemberRepository {
  async findById(id: string) {
    const row = await prisma.member.findUnique({ where: { id } });
    return row ? { id: row.id, role: row.role as Role } : null;
  }
}
