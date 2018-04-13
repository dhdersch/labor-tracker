export class Measurement {
  dilation: number;
  time: number;
  id: string;
  constructor(time?: number, dilation?: number) {
    this.dilation = dilation || 0;
    this.time = time || 0;
  }
}


export class MeasurementData {
  dilation: number;
  time: Date;
}
