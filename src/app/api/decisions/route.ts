import { useCases } from "@/composition-root";
import { handle, HttpError } from "@/presentation/http";
import { DecisionStatus } from "@/domain/Decision";
import { requireUserId } from "@/presentation/currentUser";

const STATUSES = ["proposed", "approved", "rejected", "superseded"];

export async function GET(req: Request) {
  return handle(async () => {
    const status = new URL(req.url).searchParams.get("status");
    if (status && !STATUSES.includes(status)) throw new HttpError(400, "Unknown status");
    return useCases.listDecisions.execute({
      status: (status as DecisionStatus) ?? undefined,
    });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const authorId = await requireUserId();
    const body = await req.json().catch(() => null);
    if (!body || typeof body.title !== "string" || typeof body.reason !== "string") {
      throw new HttpError(400, "title and reason must be text");
    }
    return useCases.proposeDecision.execute({
      title: body.title,
      reason: body.reason,
      authorId,
    });
  }, 201);
}
