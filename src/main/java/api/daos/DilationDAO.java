package api.daos;

import api.fhir_tools.FHIRConnection;
import api.fhir_tools.Measurement;
import api.resources.Dilation;
import api.resources.User;
import ca.uhn.fhir.model.dstu2.resource.Patient;
import ca.uhn.fhir.model.primitive.IdDt;

import java.lang.reflect.Field;
import java.util.*;

public class DilationDAO {
    private static DilationDAO instance;
    private static Map<String, List<Dilation>> patientDilations = new HashMap<>();

    private DilationDAO() {}

    public static DilationDAO getInstance() {
        if (DilationDAO.instance == null) {
            DilationDAO.instance = new DilationDAO();
            try {
                Set<String> patientIds = FHIRConnection.getInstance().getPatientIds();

                for (String patientId : patientIds) {
                    int last = 0;
                    int numPoints = (int) getRand(7, 10);
                    List<Dilation> dilations = new ArrayList<>();
                    for (int j = 4; j < numPoints; j++) {
                        dilations.add(new Dilation().setDilation(j).setDuration(last = (int) getRand(last + 1, last + 4)));
                    }
                    patientDilations.put(patientId, dilations);
                }
            } catch (Exception e){
                System.out.println(e.getMessage());
            }
        }

        return DilationDAO.instance;
    }

    static float getRand(int min, int max){
        Random rand = new Random();
        return (float)rand.nextInt((max - min) + 1) + min;
    }

    public List<Dilation> getDilations(String patientId){
        return patientDilations.get(patientId);
    }

    public List<Dilation> addDilation(String patientId, Dilation dilation){
        if(!patientDilations.containsKey(patientId)){
            patientDilations.put(patientId, new ArrayList<Dilation>());
        }
        patientDilations.get(patientId).add(dilation);
        return patientDilations.get(patientId);
    }
}
