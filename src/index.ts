console.log('webgl is here');

function webGLStart() {
  let canvas = document.getElementById("megacanvas");

  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}

