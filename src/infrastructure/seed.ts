// src/infrastructure/seed.ts
import "dotenv/config";
import { prisma } from "./prisma";

const members = [
  { id: "u1", role: "member" },
  { id: "u2", role: "lead" },
  { id: "u3", role: "lead" },
];

async function main() {
  for (const m of members) {
    await prisma.member.upsert({
      where: { id: m.id },
      create: m,
      update: { role: m.role },
    });
  }
  console.log("Seeded", members.length, "members");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
