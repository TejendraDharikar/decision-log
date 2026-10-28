import { cookies } from "next/headers";
import { HttpError } from "./http";

export async function requireUserId() {
  const store = await cookies();
  const id = store.get("user-id")?.value;
  if (!id) throw new HttpError(401, "Not logged in");
  return id;
}
