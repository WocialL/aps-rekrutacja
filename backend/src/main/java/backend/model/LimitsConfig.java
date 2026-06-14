package backend.model;
import lombok.Data;

@Data
public class LimitsConfig {
    private double maxVoltage;
    private double maxCurrent;
    private double maxTemperature;
    private double maxPower;
}
