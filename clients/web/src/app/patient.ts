export class Patient {
  id: string;
  initials: string;
  room_number: string;
  age: number;
  weight: number;
  height: number;
  num_past_vaginal_births: number;
  labor_type: string;

  public getBMI(): number {
    const BMI = this.weight / (this.height / 100 * this.height / 100);
    return Math.round(BMI * 100) / 100;
  }
}

