package api.resources;

import java.io.Serializable;
import java.util.Date;

public class User implements Serializable {

    private String patientId;

    private String firstName;

    private String lastName;

    private Date birthDate;

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String id) {
        this.patientId = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
}
