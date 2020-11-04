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

    float rowSize = 1.0 / sizeM;
    float columnSize = 1.0 / sizeN;

    vTextureCoord = vec2(columnSize * (m + aTextureCoord[0]), rowSize * (n + aTextureCoord[1]));

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    coords = vec4(aVertexPosition, 1.0);
}
