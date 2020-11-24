class Transformation {
    constructor(instant, translation, rotation, scaling) {
        this.instant = instant; // Instante da keyframe
        this.translation = translation; // [x, y, z]
        this.rotation = rotation; // [Rx, Ry, Rz]
        this.scaling = scaling; // [Sx, Sy, Sz]
    }
}