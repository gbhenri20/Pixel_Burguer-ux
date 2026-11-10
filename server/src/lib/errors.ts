export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
