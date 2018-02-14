import { mat4 } from 'gl-matrix';

console.log('webgl is here');

class GLScene {
  private readonly gl: WebGLRenderingContext
  private shaderProgram: WebGLProgram;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = GLScene.initGL(canvas);

    this.initShaders(this.gl);
    this.initBuffers(this.gl);
  }

  static initGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    try {
      let gl = canvas.getContext("webgl") as WebGLRenderingContext;
      if (!gl) {
        console.error("Could not initialise WebGL, sorry :-(");
      }
      return gl;
    } catch (e) {
      console.error("initGL has been fucked:", e);
      throw e;
    }
  }

  getShader(gl: WebGLRenderingContext, id: string): any {
    let shaderScript = document.getElementById(id) as HTMLScriptElement;
    if (!shaderScript) {
      return null;
    }

    let str = "";
    let k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    let shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      throw new Error("Unknown shader type!");
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      throw new Error("Failed to compile shader");
    }

    return shader;
  }

  initShaders(gl: WebGLRenderingContext): void {
    let fragmentShader = this.getShader(gl, "shader-fs");
    let vertexShader = this.getShader(gl, "shader-vs");

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
    // shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    // gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    // shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    // shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }

  initBuffers(gl: WebGLRenderingContext) {
    let triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    let triangleVertices = [
      0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    //triangleVertexPositionBuffer.itemSize = 3;
    //triangleVertexPositionBuffer.numItems = 3;

    let squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    let squareVertices = [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
    //squareVertexPositionBuffer.itemSize = 3;
    //squareVertexPositionBuffer.numItems = 4;
  }

  drawScene(gl: WebGLRenderingContext) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let mymat = mat4.create();

    let mvMatrix = mat4.create();
    let pMatrix = mat4.create();

    mat4.perspective(mymat, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);

    /*
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    */

    mat4.translate(null, mvMatrix, [-1.5, 0.0, -7.0]);

    let triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    let triangleVertices = [
      0.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  public init(): void {
    this.initShaders(this.gl);
    this.initBuffers(this.gl);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  public draw() : void {
    this.drawScene(this.gl);
  }
}

function webGLStart() {
  let canvas = document.getElementById("megacanvas") as HTMLCanvasElement;
  let scene = new GLScene(canvas);

  scene.init();
  scene.draw();
}

webGLStart();