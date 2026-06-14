package backend.controller;

import backend.model.LimitsConfig;
import backend.model.Measurement;
import backend.service.DataService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiController {

    private final DataService dataService;

    public ApiController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/measurements")
    public Measurement getMeasurements() {
        return dataService.getMeasurement();
    }

    @GetMapping("/limits")
    public LimitsConfig getLimits() {
        return dataService.getConfig();
    }

    @PostMapping("/limits")
    public void saveLimits(@RequestBody LimitsConfig newConfig) {
        dataService.saveConfig(newConfig);
    }
}