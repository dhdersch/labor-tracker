package api.daos;

import api.fhir_tools.FHIRConnection;
import api.resources.Dilation;
import api.resources.Observations;
import api.resources.PatientInfo;
import api.resources.User;
import ca.uhn.fhir.model.dstu2.composite.HumanNameDt;
import ca.uhn.fhir.model.dstu2.resource.Patient;
import ca.uhn.fhir.model.primitive.IdDt;

import java.util.*;

public class PatientDAO {

    private Map<String, User> users = new HashMap<>();
    private Map<String, Observations> observationsMap = new HashMap<>();
    private DilationDAO dilationDAO = DilationDAO.getInstance();

    public List<User> getPatients(){
        List<User> results = new ArrayList<>();
        for(Patient patient: FHIRConnection.getInstance().getPatients()){
            User user = constructFromPatient(patient);
            this.users.put(user.getPatientId(), user);
            results.add(user);
        }
        return results;
    }

    public User getPatient(String patientId){
        if(!users.containsKey(patientId)){
            Patient patient = FHIRConnection.getInstance().getPatient(patientId);
            User user = constructFromPatient(patient);
            users.put(patientId, user);
        }
        return users.get(patientId);
    }

    private User constructFromPatient(Patient patient){
        User user = new User();
        String patientId = patient.getId().getIdPart();
        user.setPatientId(patientId);
        HumanNameDt name = patient.getNameFirstRep();
        user.setFirstName(name.getGivenAsSingleString());
        user.setLastName(name.getFamilyAsSingleString());
        user.setBirthDate(patient.getBirthDate());

        return user;
    }

    public Observations getObservations(String patientId) {
        if (!observationsMap.containsKey(patientId)) {
            observationsMap.put(patientId, FHIRConnection.getInstance().getObservations(patientId).setDilations(dilationDAO.getDilations(patientId)));
        }
        return observationsMap.get(patientId);
    }

    public static void seedFHIR(){
        FHIRConnection fhir = FHIRConnection.getInstance();
        fhir.createPatient("71364","Tiffany","Jones",new Date(Long.parseLong("975704999") * 1000), getRand(77, 127), getRand(152, 182));
        fhir.createPatient("55647","Kim","Draper",new Date(Long.parseLong("844204199") * 1000), getRand(77, 127), getRand(152, 182));
        fhir.createPatient("45675","Kerry","Hansle",new Date(Long.parseLong("695336999") * 1000), getRand(77, 127), getRand(152, 182));
        fhir.createPatient("33646","Laura","Page",new Date(Long.parseLong("508712999") * 1000), getRand(77, 127), getRand(152, 182));
        fhir.createPatient("26357","Lacy","Naple",new Date(Long.parseLong("944082785") * 1000), getRand(77, 127), getRand(152, 182));
        fhir.createPatient("25364","Stephany","Geneva",new Date(Long.parseLong("822431585") * 1000), getRand(77, 127), getRand(152, 182));
    }

    public String createPatient(PatientInfo patientInfo){
        FHIRConnection fhir = FHIRConnection.getInstance();
        return fhir.createPatient(IdDt.newRandomUuid().getValue(),patientInfo.getFirstName(),patientInfo.getLastName(),patientInfo.getBirthDate(), patientInfo.getHeight(), patientInfo.getWeight());
    }

    static float getRand(int min, int max){
        Random rand = new Random();
        return (float)rand.nextInt((max - min) + 1) + min;
    }
}
