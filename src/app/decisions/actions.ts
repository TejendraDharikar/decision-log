import { useCases } from "@/composition-root";
import { requireUserId } from "@/presentation/currentUser";
import { userMessage } from "@/presentation/http";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function run<T>(errorPath: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const message = userMessage(e);
    if (!message) throw e;
    redirect(`${errorPath}?error=${encodeURIComponent(message)}`);
  }
}

export async function proposeDecisionAction(formData: FormData) {
  const result = await run("/decisions/new", async () => {
    const authorId = await requireUserId();
    return useCases.proposeDecision.execute({
      title: String(formData.get("title") ?? ""),
      reason: String(formData.get("reason") ?? ""),
      authorId,
    });
  });
  revalidatePath("/decisions");
  redirect(`/decisionss/${result.decisionId}`);
}

export async function approveDecisionAction(decisionId: string) {
  const path = `/decision/${decisionId}`;
  await run(path, async () => {
    const reviewerId = await requireUserId();
    return useCases.approveDecision.execute({ decisionId, reviewerId });
  });
  revalidatePath(path);
  redirect(path);
}

export async function switchUserAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  (await cookies()).set("user-id", userId, { path: "/", httpOnly: true });
  redirect("/decisions");
}
