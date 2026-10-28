// src/test-support/InMemoryMemberRepository.ts
import { Member } from "@/domain/Decision";
import { MemberRepository } from "@/application/MemberRepository";

export class InMemoryMemberRepository implements MemberRepository {
  constructor(private members: Member[] = []) {}

  async findById(id: string) {
    return this.members.find((m) => m.id === id) ?? null;
  }
}
