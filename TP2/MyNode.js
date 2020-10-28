class MyNode {
    constructor(material, texture, transformations, descendants, animation) {
        this.materialID = material;
        this.textureID = texture;
        this.transformationMatrix = transformations;
        this.descendants = descendants;
        this.animation = animation;
    }
}