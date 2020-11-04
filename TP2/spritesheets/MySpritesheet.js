class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.texture = texture; // CGFTexture
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        // Initialize Shader
        this.scene.textureShader = new CGFShader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag");

        this.textureShader.setUniformsValues( {uSampler1: 1});
    }

    activateCellMN(_m, _n) {
        this.scene.setActiveShader(this.textureShader);
        this.texture.bind();
        
        this.textureShader.setActiveShader(this.textureShader);
        this.textureShader.setUniformsValues({ sizeM: this.sizeM });
        this.textureShader.setUniformsValues({ sizeM: this.sizeN  });
        this.textureShader.setUniformsValues({ m: _m });
        this.textureShader.setUniformsValues({ n: _n });

        this.scene.setActiveShader(this.scene.defaultShader);
    }

    activateCellP(p) {
        this.m = p % this.sizeM;
        this.n = Math.floor(p / this.sizeN);
        activateCellMN(m, n);
    }
    
}