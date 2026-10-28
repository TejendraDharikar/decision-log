import "dotenv/config";
import { Decision } from "@/domain/Decision";
import { PrismaDecisionRepository } from "./PrismaDecisionRepository";

async function main() {
  const repo = new PrismaDecisionRepository();

  const d = Decision.propose({
    id: "d1",
    title: "Use Redis",
    reason: "Fast reads",
    authorId: "u1",
  });
  await repo.save(d);

  d.approve({ id: "u2", role: "lead" });
  await repo.save(d);

  console.log(await repo.findById("d1"));
  console.log((await repo.list({ status: "approved" })).length);
}

main();
