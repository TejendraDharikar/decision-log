// src/app/api/decisions/[id]/route.ts
import { useCases } from "@/composition-root";
import { handle } from "@/presentation/http";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await ctx.params;
    return useCases.getDecision.execute({ decisionId: id });
  });
}
