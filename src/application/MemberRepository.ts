import { Member } from "@/domain/Decision";

export interface MemberRepository {
  findById(id: string): Promise<Member | null>;
}
