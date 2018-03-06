package api.resources;

import java.io.Serializable;
import java.util.List;

public class Observations implements Serializable {
    private double height;

    private double weight;

    private List<Dilation> dilations;

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public List<Dilation> getDilations() {
        return dilations;
    }

    public Observations setDilations(List<Dilation> dilations) {
        this.dilations = dilations;
        return this;
    }
}
