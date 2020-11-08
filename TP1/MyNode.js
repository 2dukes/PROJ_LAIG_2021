class MyNode {
    constructor(material, texture, transformations, descendants) {
        this.materialID = material;
        this.textureID = texture;
        this.transformationMatrix = transformations;
        this.descendants = descendants;
    }
}