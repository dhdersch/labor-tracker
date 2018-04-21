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

  public match(num: number): Point {
    const rounded_num = Math.round(num);
    if (rounded_num < 5 ) {
        return this.values[0];
    } else if (rounded_num > 10) {
        return this.values[this.values.length - 1];
    } else {
        for (const point of this.values){
          if (rounded_num === point.hours) {
            return point;
          }
        }
     }
     return null;
  }
}

export class Point {
  constructor(public hours: number, public dilation: number) {
  }
}
