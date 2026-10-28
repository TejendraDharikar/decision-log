import { cookies } from "next/headers";
import Link from "next/link";
import { switchUserAction } from "./actions";

const USERS = ["u1", "u2", "u3"];

export default async function DecisionLayout({ children }: { children: React.ReactNode }) {
  const current = (await cookies()).get("user-id")?.value ?? "";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <header className="mb-6 flex items-center justify-between border-b pb-3">
        <Link href="/decisions" className="font-semibold">
          Decision Log
        </Link>
        <form action={switchUserAction} className="flex items-center gap-2 text-sm">
          <span>{current ? `Acting as ${current}` : "Not logged in"}</span>
          <select name="userId" defaultValue={current} className="rounded border px-1">
            {USERS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <button className="rounded border px-2">Switch</button>
        </form>
      </header>
      {children}
    </div>
  );
}
