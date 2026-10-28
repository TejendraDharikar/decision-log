// src/app/api/decisions/[id]/approve/route.ts
import { useCases } from "@/composition-root";
import { handle } from "@/presentation/http";
import { requireUserId } from "@/presentation/currentUser";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const reviewerId = await requireUserId();
    const { id } = await ctx.params;
    return useCases.approveDecision.execute({ decisionId: id, reviewerId });
  });
}
