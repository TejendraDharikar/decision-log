import { DomainError } from "./errors";

export type DecisionStatus = "proposed" | "approved" | "rejected" | "superseded";

export type Role = "member" | "lead";

export interface Member {
  id: string;
  role: Role;
}

export class Decision {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly reason: string,
    public readonly authorId: string,
    private _status: DecisionStatus,
    private _supersededBy?: string,
  ) {}

  static propose(props: { id: string; title: string; reason: string; authorId: string }) {
    if (!props.title.trim()) throw new DomainError("Title is required");
    if (!props.reason.trim()) throw new DomainError("Reason is required");
    return new Decision(props.id, props.title, props.reason, props.authorId, "proposed");
  }

  static restore(props: {
    id: string;
    title: string;
    reason: string;
    authorId: string;
    status: DecisionStatus;
    supersededBy?: string;
  }) {
    return new Decision(
      props.id,
      props.title,
      props.reason,
      props.authorId,
      props.status,
      props.supersededBy,
    );
  }

  get status() {
    return this._status;
  }
  get supersededBy() {
    return this._supersededBy;
  }

  approve(by: Member) {
    this.assertCanReview(by);
    this._status = "approved";
  }

  reject(by: Member) {
    this.assertCanReview(by);
    this._status = "rejected";
  }

  supersede(newDecision: Decision) {
    if (this._status !== "approved")
      throw new DomainError("Only approved decisions can be superseded");
    if (newDecision.status !== "approved") throw new DomainError("Replacement must be approved");
    if (newDecision.id === this.id) throw new DomainError("A decision cannot supersede itself");
    this._status = "superseded";
    this._supersededBy = newDecision.id;
  }

  private assertCanReview(by: Member) {
    if (this._status !== "proposed") throw new DomainError("Decision already reviewed");
    if (by.role !== "lead") throw new DomainError("only lead can review decisions");
    if (by.id === this.authorId) throw new DomainError("Authors cannot review their own decisions");
  }
}
