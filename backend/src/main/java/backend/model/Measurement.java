package backend.model;
import lombok.Data;

@Data
public class Measurement {
    private double voltage;
    private double current;
    private double power;
    private double temperature;
}
