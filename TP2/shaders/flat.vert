#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

varying vec4 coords;

uniform float sizeM;
uniform float sizeN;
uniform float m;
uniform float n;

void main() {

    float rowSize = 1 / sizeM;
    float columnSize = 1 / sizeN;

    if(aTextureCoord[0] == 0 && aTextureCoord[1] == 0) // Vértice superior esquerdo
        column_begin = columnSize * m;
        row_begin = rowSize * n;
        
    
    if(aTextureCoord[0] == 1 && aTextureCoord[1] == 1) // Vértice inferior direito
        column_begin = columnSize * (m + 1);
        row_begin = rowSize * (n + 1);
    
    if(aTextureCoord[0] == 1 && aTextureCoord[1] == 0) // Vértice superior direito
        column_begin = columnSize * (m + 1);
        row_begin = rowSize * n;


    if(aTextureCoord[0] == 0 && aTextureCoord[1] == 1) // Vértice inferior esquerdo
        column_begin = columnSize * m;
        row_begin = rowSize * (n + 1);

    vTextureCoord = vec2(column_begin, row_begin);




    vTextureCoord = aTextureCoord;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    coords = vec4(aVertexPosition, 1.0);
}
