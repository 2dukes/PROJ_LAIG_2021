class Transformation {
    constructor(instant, translation, rotation, scaling) {
        this.instant = instant; // Instante da keyframe
        this.translation = translation; // vec3(x, y, z)
        this.rotation = rotation; // vec3(Rx, Ry, Rz)
        this.scaling = scaling; // vec3()
    }
}