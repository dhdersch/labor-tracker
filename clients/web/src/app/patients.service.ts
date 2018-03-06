import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PatientsService {
  private apiPatientsUrl = 'http://localhost:8080/patients';
  private apiObservationsUrl = 'http://localhost:8080/observations';
  patients: Patient[] = [];
  dilations: any = {};
  dystocia: any = {};
  status: any = {};
  public remainingDilations: number[] = [];
  public remainingDurations: number[] = [];
  public onChanged: EventEmitter<DataPoints[]> = new EventEmitter<DataPoints[]>();
  currentPatient: number;
  constructor(private http: Http) {
    this.getData();
    this.currentPatient = 0;
  }

  updateCurrentPatient(patientIndex) {
    this.currentPatient = patientIndex;
    this.getCurrentPatient().active = true;
    const dataPoints = this.getDataPoints();
    this.onChanged.emit(dataPoints);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getData() {
    this.http.get(this.apiPatientsUrl).subscribe(data => {
      // console.log(data.json());
      const patients = data.json();
      patients.forEach((patient, index) => {
        this.patients.push(new Patient(patient.patientId,
                                       patient.firstName,
                                       patient.lastName,
                                       patient.birthDate,
                                       patient.weight,
                                       patient.height,
                                       patient.bmi));
      });
      this.onChanged.emit(this.getDataPoints());
    });
    // return this.http.get(this.apiUrl).map((res: Response) => res.json());
  }

  getPatients(): Patient[] {
    return this.patients;
  }

  getPatientStatus(patient: Patient): boolean {
    const dystocia = this.getDystociaByBmi(patient.getBmi());
    const dilations = this.getDilationsByPatient(patient);
    let lastDilation = null;

    if (dilations && dilations.values.length > 0) {
      lastDilation = dilations.values[dilations.values.length - 1];
    }
    if (lastDilation != null && lastDilation.duration > dystocia.values[dystocia.values.length - 1].duration) {
      patient.status = false;
    } else {
      for (let i = 0; i < dystocia.values.length; i++) {
        if (lastDilation != null
            && (lastDilation.hours <= dystocia.values[i].hours && lastDilation.duration >= dystocia.values[i].duration)) {
              patient.status = false;
              break;
        }
      }
    }
    return patient.status;
  }

  getCurrentPatient(): Patient {
    const patient = this.patients[this.currentPatient];
    return patient;
  }

  getDilations(): DataPoints {
    return this.getDilationsByPatient(this.getCurrentPatient());
  }

  getDilationsByPatient(patient: Patient): DataPoints {
    if (!patient) {
      return undefined;
    }
    if (patient.patientId in this.dilations) {
      return this.dilations[patient.patientId];
    }
    // get from api and set local cache
    if (!patient.weight) {
      this.http.get(this.apiObservationsUrl + `/${patient.patientId}`)
      .toPromise()
      .then((response) => {
        const data = response.json();
        // console.log(data);
        patient.weight = data.weight;
        patient.height = (data.height * 2.54);
        const values: Point[] = [];
        if (data.dilations != null) {
          data.dilations.forEach(point => {
            values.push(new Point(point.dilation, point.duration));
          });
        }

        this.dilations[patient.patientId] = new DataPoints(patient.toString(), values);
        this.getPatientStatus(patient);
        this.dilations[patient.patientId].color = patient.status ? '#56CC9D' : '#FF7851';
      });
      return this.dilations[patient.patientId];
    }
  }

  getDystocia(): DataPoints {
    if (!this.getCurrentPatient()) {
      return undefined;
    }
    return this.getDystociaByBmi(this.getCurrentPatient().getBmi());
  }

  getDystociaByBmi(bmi: number): DataPoints {
    const currentBmi = bmi;
    if (currentBmi < 25) {
      return new DataPoints(
          'Dystocia for BMI (< 25)',
          [
              new Point(5, 4.6),
              new Point(6, 7.5),
              new Point(7, 9.5),
              new Point(8, 11.0),
              new Point(9, 12.3),
              new Point(10, 13.9)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 25 && currentBmi < 30) {
      return new DataPoints(
          'Dystocia for BMI (25-30)',
          [
              new Point(5, 5.0),
              new Point(6, 7.9),
              new Point(7, 9.9),
              new Point(8, 11.4),
              new Point(9, 12.7),
              new Point(10, 14.4)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 30 && currentBmi < 35) {
      return new DataPoints(
          'Dystocia for BMI (30-35)',
          [
              new Point(5, 5.2),
              new Point(6, 8.3),
              new Point(7, 10.4),
              new Point(8, 11.9),
              new Point(9, 13.3),
              new Point(10, 15.1)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 35 && currentBmi < 40) {
      return new DataPoints(
          'Dystocia for BMI (35-40)',
          [
              new Point(5, 5.9),
              new Point(6, 9.4),
              new Point(7, 11.7),
              new Point(8, 13.4),
              new Point(9, 14.7),
              new Point(10, 16.6)
          ],
          '#FFCE67'
      );
    }else if (currentBmi >= 40) {
      return new DataPoints(
        'Dystocia for BMI (> 40)',
        [
            new Point(5, 7.4),
            new Point(6, 11.6),
            new Point(7, 14.1),
            new Point(8, 15.8),
            new Point(9, 17.2),
            new Point(10, 19.1)
        ],
        '#FFCE67'
      );
    }
  }

  getDataPoints(): DataPoints[] {
    return [this.getDilations(), this.getDystocia()];
  }
}

export class Patient {
  public active = false;
  public status = true;
  constructor(public patientId: string,
              public firstName: string,
              public lastName: string,
              public birthDate: string,
              public weight: number,
              public height: number,
              public bmi: number) {
  }

  public getBirthDate(): String {
    return new Date(this.birthDate).toDateString();
  }

  public getBmi(): number {
    const BMI = this.weight / (this.height / 100 * this.height / 100);
    return Math.round(BMI * 100) / 100;
  }

  toString(): string {
    return `${this.firstName} ${this.lastName} \(${this.patientId}\)`;
  }
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
