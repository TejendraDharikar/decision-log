// src/infrastructure/PrismaDecisionRepository.test.ts
import { PrismaDecisionRepository } from "@/infrastructure/PrismaDecisionRepository";
import { prisma } from "@/infrastructure/prisma";
import { decisionRepositoryContract } from "@/test-support/decisionRepositoryContract";

decisionRepositoryContract("Prisma", async () => {
  await prisma.decision.deleteMany(); // start every test with an empty table
  return new PrismaDecisionRepository();
});
