class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.scene.texture = texture; // CGFTexture
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        // Initialize Shader
        this.scene.textureShader = new CGFshader(this.scene.gl, "./shaders/flat.vert", "./shaders/flat.frag");
    }

   activateCellMN(_m, _n) {
        this.scene.setActiveShader(this.scene.textureShader);
        this.scene.texture.bind();
        this.scene.textureShader.setUniformsValues({ sizeM: this.sizeM });
        this.scene.textureShader.setUniformsValues({ sizeN: this.sizeN  });
        this.scene.textureShader.setUniformsValues({ m: _m });
        this.scene.textureShader.setUniformsValues({ n: _n });
    } 

    activateCellP(p) {
        // Compute the number of the column and row
        this.m = p % this.sizeM;
        this.n = Math.floor(p / this.sizeN);

        this.activateCellMN(this.m, this.n);
    }

    setDefaultShader() {
        this.scene.setActiveShader(this.scene.defaultShader);
    }

}