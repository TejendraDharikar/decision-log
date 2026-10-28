import { NotFoundError } from "@/application/errors";
import { DomainError } from "@/domain/errors";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function handle(fn: () => Promise<unknown>, successStatus = 200) {
  try {
    return Response.json(await fn(), { status: successStatus });
  } catch (e) {
    if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
    if (e instanceof NotFoundError) return Response.json({ error: e.message }, { status: 404 });
    if (e instanceof DomainError) return Response.json({ error: e.message }, { status: 422 });
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export function userMessage(e: unknown): string | null {
  if (e instanceof HttpError || e instanceof NotFoundError || e instanceof DomainError) {
    return e.message;
  }
  return null;
}
