class MySpriteSheet {
    constructor(texture, sizeM, sizeN, scene) {
        this.texture = texture; // CGFTexture
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.scene = scene;

        // provide the shader with the array of spritesheet dimensions [size_c, size_l]

        // Initialize Shader
        this.scene.textureShader = new CGFShader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag");

        this.textureShader.setUniformsValues( {uSampler1: 1});

    }

    activateCellMN(_m, _n) {
        this.scene.setActiveShader(this.textureShader);
        this.texture.bind();
        
        this.scene.setActiveShader(this.textureShader);
        this.shader.setUniformsValues({ sizeM: this.sizeM });
        this.shader.setUniformsValues({ sizeM: this.sizeN  });
        this.shader.setUniformsValues({ m: _m });
        this.shader.setUniformsValues({ n: _n });

        this.scene.setActiveShader(this.scene.defaultShader);
    }

    activateCellP(p) {
        this.m = p % this.sizeM;
        this.n = Math.floor(p / this.sizeN);
        activateCellMN(m, n);
    }
    
}