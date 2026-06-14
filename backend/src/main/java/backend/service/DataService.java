package backend.service;

import backend.model.LimitsConfig;
import backend.model.Measurement;
import jakarta.annotation.PostConstruct;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class DataService {

    @Value("${app.data.measurements-file}")
    private String measurementsPath;

    @Value("${app.data.config-file}")
    private String configPath;

    private final ObjectMapper mapper;

    private Measurement measurement = new Measurement();
    private LimitsConfig config = new LimitsConfig();

    public DataService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    public void init() {
        loadConfig();
        loadMeasurements();
    }

    @Scheduled(fixedRate = 1000)
    public void loadMeasurements() {
        File file = new File(measurementsPath);
        if (file.exists()) {
            measurement = mapper.readValue(file, Measurement.class);
        }
    }

    public Measurement getMeasurement() {
        return measurement;
    }

    public synchronized void loadConfig() {
        File file = new File(configPath);
        if (file.exists()) {
            config = mapper.readValue(file, LimitsConfig.class);
        }
    }

    public synchronized LimitsConfig getConfig() {
        return config;
    }

    public synchronized void saveConfig(LimitsConfig newConfig) {
        File file = new File(configPath);
        mapper.writeValue(file, newConfig);
        this.config = newConfig;
    }
}