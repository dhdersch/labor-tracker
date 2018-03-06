package api.controllers;

import api.daos.DilationDAO;
import api.resources.Dilation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DilationController {

    private DilationDAO dilationDAO = DilationDAO.getInstance();

    @RequestMapping(value = "/dilations/{patientId}", method = RequestMethod.POST)
    public ResponseEntity<List<Dilation>> create(@PathVariable("patientId") String patientId, @RequestBody Dilation dilation) {
        return new ResponseEntity<>(dilationDAO.addDilation(patientId, dilation), HttpStatus.OK);
    }
}
