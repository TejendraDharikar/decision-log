export type Severity = "low" | "medium" | "high";
export type IncidentStatus = "open" | "resolved";
export class Incident {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly severity: Severity,
    private _status: IncidentStatus,
    private _decisionId?: string,
  ) {}

  static open(props: { id: string; title: string; severity: Severity }) {
    if (!props.title.trim()) throw new Error("Title is required");
    return new Incident(props.id, props.title, props.severity, "open");
  }

  static restore(props: {
    id: string;
    title: string;
    severity: Severity;
    status: IncidentStatus;
    decisionId?: string;
  }) {
    return new Incident(props.id, props.title, props.severity, props.status, props.decisionId);
  }

  get status() {
    return this._status;
  }
  get decisionId() {
    return this._decisionId;
  }

  linkDecision(decisionId: string) {
    if (this._status === "resolved") throw new Error("Cannot change a resolved incident");
    this._decisionId = decisionId;
  }

  resolve() {
    if (this._status === "resolved") throw new Error("Incident already resolved");
    if (this.severity === "high" && !this._decisionId) {
      throw new Error("High severity incidents need a linked decision before resolving");
    }
    this._status = "resolved";
  }
}
