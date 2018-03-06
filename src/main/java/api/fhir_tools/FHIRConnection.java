package api.fhir_tools;

import api.daos.PatientDAO;
import api.resources.Observations;
import api.resources.User;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.base.composite.BaseIdentifierDt;
import ca.uhn.fhir.model.dstu2.composite.CodeableConceptDt;
import ca.uhn.fhir.model.dstu2.composite.HumanNameDt;
import ca.uhn.fhir.model.dstu2.composite.IdentifierDt;
import ca.uhn.fhir.model.dstu2.composite.QuantityDt;
import ca.uhn.fhir.model.dstu2.composite.ResourceReferenceDt;
import ca.uhn.fhir.model.dstu2.resource.Bundle;
import ca.uhn.fhir.model.dstu2.resource.Observation;
import ca.uhn.fhir.model.dstu2.resource.Patient;
import ca.uhn.fhir.model.dstu2.valueset.AdministrativeGenderEnum;
import ca.uhn.fhir.model.dstu2.valueset.BundleTypeEnum;
import ca.uhn.fhir.model.dstu2.valueset.HTTPVerbEnum;
import ca.uhn.fhir.model.dstu2.valueset.ObservationStatusEnum;
import ca.uhn.fhir.model.primitive.DateDt;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.rest.client.api.IGenericClient;

import java.util.*;

import static api.fhir_tools.LOINCCodes.BMI;
import static api.fhir_tools.LOINCCodes.HEIGHT;
import static api.fhir_tools.LOINCCodes.WEIGHT;
import static ca.uhn.fhir.model.dstu2.valueset.AdministrativeGenderEnum.FEMALE;

public class FHIRConnection {

    private static FHIRConnection instance;
    private IGenericClient client;
    private FhirContext ctx = FhirContext.forDstu2();
    private String system = "labor-tracker";
    private Set<String> patientIds = new HashSet(){{
        add("11");
        add("2525");
        add("2526");
        add("2527");
        add("2528");
        add("16");
        add("15");
        add("17");
        add("1");
        add("5");
    }};

    private FHIRConnection() {
        String serverBase = "http://ehr.hdap.gatech.edu:8080/gt-exact/base";
        this.client = this.ctx.newRestfulGenericClient(serverBase);
    }

    public static FHIRConnection getInstance() {
        if (FHIRConnection.instance == null) {
            FHIRConnection.instance = new FHIRConnection();
            //PatientDAO.seedFHIR();
        }

        return FHIRConnection.instance;
    }

    public Patient getPatient(String patientId) {
        Bundle.Entry patient = client
                .search()
                .forResource(Patient.class)
                .where(Patient.RES_ID.matches().value(patientId))
                .returnBundle(Bundle.class)
                .execute()
                .getEntryFirstRep();

        return ((Patient) patient.getResource());
    }

    public List<Patient> getPatients(){
        return getPatients(patientIds);
    }

    public Set<String> getPatientIds() {
        return patientIds;
    }

    private List<Patient> getPatients(Collection<String> patientIds) {
        List<Patient> patientList = new ArrayList<>();
        for(String patientId: patientIds){
            patientList.add(getPatient(patientId));
        }
        return patientList;
    }

    public Observations getObservations(String patientId){
        List<Bundle.Entry> entries = client
                .search()
                .forResource(Observation.class)
                .where(Observation.SUBJECT.hasId(patientId))
                .returnBundle(ca.uhn.fhir.model.dstu2.resource.Bundle.class)
                .execute()
                .getEntry();

        Observations heightWeight = new Observations();
        for(Bundle.Entry entry: entries){
            Observation observation = ((Observation) entry.getResource());
            String obsCode = observation.getCode().getCodingFirstRep().getCode();
            if(HEIGHT.equals(obsCode)){
                double obsValue = ((QuantityDt) observation.getValue()).getValue().doubleValue();
                heightWeight.setHeight(obsValue);
            }
            if(WEIGHT.equals(obsCode)){
                double obsValue = ((QuantityDt) observation.getValue()).getValue().doubleValue();
                heightWeight.setWeight(obsValue);
            }
        }
        return heightWeight;
    }

    public String createPatient(String patientId, String firstName, String lastName, Date birthDate, double weight, double height){
        // Create a patient object
        Patient patient = new Patient();
        patient.addIdentifier()
                .setSystem(system)
                .setValue(patientId);
        patient.addName()
                .addFamily(firstName)
                .addGiven(lastName);
        patient.setGender(AdministrativeGenderEnum.FEMALE);
        patient.setBirthDate(new DateDt(birthDate));

        // Give the patient a temporary UUID so that other resources in
        // the transaction can refer to it
        patient.setId(IdDt.newRandomUuid());

        // Create an observation object
        Observation observation = new Observation();
        observation.setStatus(ObservationStatusEnum.FINAL);
        observation
                .getCode()
                .addCoding()
                .setSystem("http://loinc.org")
                .setCode(LOINCCodes.WEIGHT)
                .setDisplay("Patients Weight");
        observation.setValue(
                new QuantityDt()
                        .setValue(weight)
                        .setUnit("kg")
                        .setSystem("http://unitsofmeasure.org")
                        .setCode("10*12/L"));

        // Create an observation object
        Observation observation2 = new Observation();
        observation2.setStatus(ObservationStatusEnum.FINAL);
        observation2
                .getCode()
                .addCoding()
                .setSystem("http://loinc.org")
                .setCode(LOINCCodes.HEIGHT)
                .setDisplay("Patients Weight");
        observation2.setValue(
                new QuantityDt()
                        .setValue(height)
                        .setUnit("cm")
                        .setSystem("http://unitsofmeasure.org")
                        .setCode("10*12/L"));

        // The observation refers to the patient using the ID, which is already
        // set to a temporary UUID
        observation.setSubject(new ResourceReferenceDt(patient.getId().getValue()));
        observation2.setSubject(new ResourceReferenceDt(patient.getId().getValue()));

        // Create a bundle that will be used as a transaction
        Bundle bundle = new Bundle();
        bundle.setType(BundleTypeEnum.TRANSACTION);

        // Add the patient as an entry. This entry is a POST with an
        // If-None-Exist header (conditional create) meaning that it
        // will only be created if there isn't already a Patient with
        // the identifier 12345
        bundle.addEntry()
                .setFullUrl(patient.getId().getValue())
                .setResource(patient)
                .getRequest()
                .setUrl("Patient")
                .setIfNoneExist(String.format("identifier=labor-tracker|{0}", patient.getId().getValue()))
                .setMethod(HTTPVerbEnum.POST);

        // Add the observation. This entry is a POST with no header
        // (normal create) meaning that it will be created even if
        // a similar resource already exists.
        bundle.addEntry()
                .setResource(observation)
                .getRequest()
                .setUrl("Weight")
                .setMethod(HTTPVerbEnum.POST);
        bundle.addEntry()
                .setResource(observation2)
                .getRequest()
                .setUrl("Height")
                .setMethod(HTTPVerbEnum.POST);

        // Log the request
        System.out.println(this.ctx.newXmlParser().setPrettyPrint(true).encodeResourceToString(bundle));

        // Create a client and post the transaction to the server
        Bundle resp = this.client.transaction().withBundle(bundle).execute();

        String createdPatientId = null;
        for(Bundle.Entry entry: resp.getEntry()){
            String location = entry.getResponse().getLocation();
            if(location.startsWith("Patient/")){
                location = location.replace("Patient/", "");
                createdPatientId = location.substring(0,location.indexOf("/"));
                patientIds.add(createdPatientId);
            }
        }
        // Log the response
        System.out.println(this.ctx.newXmlParser().setPrettyPrint(true).encodeResourceToString(resp));

        return createdPatientId;
    }
}
