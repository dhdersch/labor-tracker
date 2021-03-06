export class Partogram {
  partogram_id: string;
  patient_id: string;
  labor_start_time: number;
  initials: string;
  room: string;

  public getDate(): Date {
    return new Date(this.labor_start_time * 1000);
  }
}
