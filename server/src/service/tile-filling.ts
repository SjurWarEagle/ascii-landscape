class Data {
  source: string;
  candidates: { tile: string; weight: number }[];
}

export class TileFilling {
  public data: Array<Data> = new Array<Data>();
}
