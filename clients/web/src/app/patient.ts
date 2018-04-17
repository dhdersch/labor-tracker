export class Patient {
  id: string;
  initials: string;
  room_number: string;
  age: number;
  weight: number;
  height: number;
  num_past_vaginal_births: number;
  labor_type: string;
}

export class DataPoints {
  constructor(public name: string,
              public values: Point[],
              public color: string= '#78C2AD') {
  }
}

export class Point {
  constructor(public hours: number, public duration: number) {
  }
}