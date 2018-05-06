var c, ctx,
    mx = my = mux = muy = 0, md = false,
    PI = Math.PI, TAU = PI * 2,
    keyCodes = [];

function windowLoad(){
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  windowResize();
  window.addEventListener("resize", windowResize, false);

  c.addEventListener("mousemove", mouseMove, false);
  c.addEventListener("mousedown", mouseDown, false);
  c.addEventListener("mouseup", mouseUp, false);

  document.addEventListener("keydown", keyDown, false);
  document.addEventListener("keyup", keyUp, false);

  update();
}

var x1 = 100, y1 = 100, x2 = 300, y2 = 300;

function update(){
  ctx.clearRect(0, 0, c.width, c.height);

  var p = npfs(x1, y1, x2, y2, mx, my);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(p.x, p.y, 5, 0, TAU);
  ctx.stroke();

  window.requestAnimationFrame(update);
}

window.addEventListener("load", windowLoad, false);

function windowResize(){
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}

function mouseMove(e){
  setMousePosition(e);
}

function mouseDown(e){
  x1 = mx;
  y1 = my;
  setMousePosition(e);
  md = true;
}

function mouseUp(e){
  mux = mx;
  muy = my;
  setMousePosition(e);
  md = false;
}

function setMousePosition(e){
  mx = e.clientX;
  my = e.clientY;
}

function keyDown(e){
  keyCodes[e.keyCode] = true;
}

function keyUp(e){
  keyCodes[e.keyCode] = false;
}

function distance(fx, fy, tx, ty){
  return Math.sqrt(Math.pow(fx - tx, 2) + Math.pow(fy - ty, 2));
}

function npfs(x1, y1, x2, y2, x, y){
  var dx = x2 - x1;
  var dy = y2 - y1;
  var m = dy/dx;

  if(dy == 0){
    if(x1 > x2){
      tx = x1;
      x1 = x2;
      x2 = tx;
      ty = y1;
      y1 = y2;
      y2 = ty;
    }
    if(x1 < x && x < x2){
      return {x: x, y: y1};
    } else{
      if(x <= x1) return {x: x1, y: y1};
      else return {x: x2, y: y2};
    }
  } else if(dx == 0){
    if(y1 > y2){
      tx = x1;
      x1 = x2;
      x2 = tx;
      ty = y1;
      y1 = y2;
      y2 = ty;
    }
    if(y1 < y && y < y2){
      return {x: x1, y: y};
    } else{
      if(y <= y1) return {x: x1, y: y1};
      else return {x: x2, y: y2};
    }
  } else{
    if(x1 > x2){
      tx = x1;
      x1 = x2;
      x2 = tx;
      ty = y1;
      y1 = y2;
      y2 = ty;
    }
    cx = (m * x1 - (-1/m) * x + y - y1)/(m + 1/m);
    cy = m * (cx - x1) + y1;

    if(x1 < cx && cx < x2){
      return {x: cx, y: cy};
    } else{
      if(cx <= x1) return {x: x1, y: y1};
      else return {x: x2, y: y2};
    }
  }
}


function nearestPointFromSegment(x1, y1, x2, y2, x3, y3){
  var segmentLength = distance(x1, y1, x2, y2),
  h1 = distance(x1, y1, x3, y3),
  lineAngle = Math.atan2(y2 - y1, x2 - x1),
  angle = Math.atan2(y3 - y1, x3 - x1) - lineAngle,
  b1 = h1 * Math.sin(angle) / Math.tan(angle),
  x = x1 + Math.cos(lineAngle) * b1,
  y = y1 + Math.sin(lineAngle) * b1,
  d = distance(x, y, x3, y3),
  sx = Math.min(x1, x2),
  sy = Math.min(y1, y2),
  spy = sx == x1 ? y1 : y2,
  sd = distance(x3, y3, sx, spy),
  bx = Math.max(x1, x2),
  by = Math.max(y1, y2),
  bpy = bx == x1 ? y1 : y2,
  bd = distance(x3, y3, bx, bpy);

  if(sx <= x && x <= bx &&
  sy <= y && y <= by){
    return {
      x: x,
      y: y,
      distance: d
    }
  } else{
    if(sd < bd){
      return {
        x: sx,
        y: spy,
        distance: sd
      }
    } else{
      return {
        x: bx,
        y: bpy,
        distance: bd
      }
    }
  }
}
