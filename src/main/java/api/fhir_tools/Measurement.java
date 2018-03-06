package api.fhir_tools;

public class Measurement {
    private double measurement;
    private String units;

    public Measurement(double measurement, String units){
        this.measurement = measurement;
        this.units = units;
    }

    public double getMeasurement() {
        return measurement;
    }

    public void setMeasurement(double measurement) {
        this.measurement = measurement;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }
}
