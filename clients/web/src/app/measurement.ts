export class Measurement {
  dilation: number;
  time: Date;
  id: string;
  constructor(time?: number, dilation?: number) {
    this.dilation = dilation || 0;
    this.time = time ? new Date(time * 1000) : new Date();
    this.time.setSeconds(0, 0);
  }
}

export class MeasurementBackend {
  dilation: number;
  time: number;
  id: string;
}

export class MeasurementData {
  dilation: number;
  time: Date;
}
