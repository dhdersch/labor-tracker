package api.controllers;

import api.daos.DilationDAO;
import api.daos.PatientDAO;
import api.resources.Dilation;
import api.resources.Observations;
import api.resources.PatientInfo;
import api.resources.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PatientController {

    private PatientDAO patientDao = new PatientDAO();

    @RequestMapping("/patients/{patientId}")
    public User user(@PathVariable("patientId") String patientId) {
        return patientDao.getPatient(patientId);
    }

    @RequestMapping("/patients")
    public List<User> users() {
        return patientDao.getPatients();
    }

    @RequestMapping("/observations/{patientId}")
    public Observations observations(@PathVariable("patientId") String patientId){
        return patientDao.getObservations(patientId);
    }

    @RequestMapping(value = "/patients", method = RequestMethod.POST)
    public ResponseEntity<String> observations(@RequestBody PatientInfo patientInfo){
        return new ResponseEntity<>(patientDao.createPatient(patientInfo), HttpStatus.OK);
    }
}
