export abstract class DomainEvent<T> {
  public readonly eventId: string;
  public readonly name: string;
  public readonly timeStamp: Date;
  public readonly payload: T;
  public readonly correlationId?: string;
  public readonly version: number;

  protected constructor(
    eventId: string,
    name: string,
    payload: T,
    options: { correlationId?: string; version?: number } = {},
  ) {
    this.eventId = eventId;
    this.name = name;
    this.timeStamp = new Date();
    this.payload = payload;
    this.correlationId = options.correlationId;
    this.version = options.version || 1;
  }

  toJSON(): string {
    return JSON.stringify({
      eventId: this.eventId,
      name: this.name,
      occurredOn: this.timeStamp.toISOString(),
      payload: this.payload,
      correlationId: this.correlationId,
      version: this.version,
    });
  }
}
