export interface IPonudjaci {
  id?: number;
  naziv?: string;
}

export class Ponudjaci implements IPonudjaci {
  constructor(public id?: number, public naziv?: string) {}
}

export function getPonudjaciIdentifier(ponudjaci: IPonudjaci): number | undefined {
  return ponudjaci.id;
}
