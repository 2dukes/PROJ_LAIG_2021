class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.texture = texture; // CGFTexture
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        // Initialize Shader
        this.scene.textureShader = new CGFshader(this.scene.gl, "./shaders/flat.vert", "./shaders/flat.frag");
    }

   activateCellMN(_m, _n) {
        this.scene.setActiveShaderSimple(this.scene.textureShader);
        this.scene.texture = this.texture;
        this.scene.texture.bind();
        this.scene.textureShader.setUniformsValues({ sizeM: this.sizeM });
        this.scene.textureShader.setUniformsValues({ sizeN: this.sizeN  });
        this.scene.textureShader.setUniformsValues({ m: _m });
        this.scene.textureShader.setUniformsValues({ n: _n });
    } 

    activateCellP(p) {
        // Compute the number of the column and row
        let m = p % this.sizeN;
        let n = Math.floor(p / this.sizeN);

        this.activateCellMN(m, n);
    }

    setDefaultShader() {
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}