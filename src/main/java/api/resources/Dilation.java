package api.resources;

import java.io.Serializable;
import java.util.Date;

public class Dilation implements Serializable {
    private double dilation;
    private double duration;

    public double getDilation() {
        return dilation;
    }

    public Dilation setDilation(double dilation) {
        this.dilation = dilation;
        return this;
    }

    public double getDuration() {
        return duration;
    }

    public Dilation setDuration(double duration) {
        this.duration = duration;
        return this;
    }
}
