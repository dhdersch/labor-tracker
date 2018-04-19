export class Partogram {
  partogram_id: string;
  patient_id: string;
  labor_start_time: number;

  public getDate(): Date {
    return new Date(this.labor_start_time * 1000);
  }
}
