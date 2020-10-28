class MyNode {
    constructor(material, texture, transformations, descendants, animationID) {
        this.materialID = material;
        this.textureID = texture;
        this.transformationMatrix = transformations;
        this.descendants = descendants;
        this.animationID = animationID;
    }
}