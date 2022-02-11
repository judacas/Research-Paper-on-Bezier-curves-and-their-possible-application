var amtOfCurves = 1;
var points = new Array(3);
var closestIndex = 0;
var derivativeT = 0,
  derivativeCurve = 0;
var StartTime = Date.now();
var speed = 5000;
var normalDeriv, half, newPoint;
reset();

function draw() {
  checkKeyboard();
  update();
  checkMouse();
}

function update() {
  background("white");
  text("current degree = " + amtOfCurves.toString(), 0, 15);
  // console.log(points);
  stroke("red");
  strokeWeight(10);
  for (var curve = 1; curve <= (points.length - 1) / 2; curve++) {
    for (var t = 0; t < 1; t += 0.1) {
      var newPoint = getPoint(
        points[curve * 2 - 2],
        points[curve * 2 - 1],
        points[curve * 2],
        t
      );
      point(newPoint.x, newPoint.y);
    }
  }

  stroke("black");
  strokeWeight(15);
  for (var i = 0; i < points.length; i++) {
    point(points[i].x, points[i].y);
  }
  stroke("blue");
  strokeWeight(10);
  normalDeriv = getDerivative(
    points[derivativeCurve * 2],
    points[derivativeCurve * 2 + 1],
    points[derivativeCurve * 2 + 2],
    derivativeT
  );
  normalDeriv = normalDeriv.scale(1 / normalDeriv.magnitude);

  // console.log("Derivative" + normalDeriv);
  half = getPoint(
    points[derivativeCurve * 2],
    points[derivativeCurve * 2 + 1],
    points[derivativeCurve * 2 + 2],
    derivativeT
  );
  // console.log(" point " + half);
  scalar = 0;
  for (var i = 0; i < 30; i++) {
    scalar = i * ((i % 2) * 2 - 1) * 5;
    var newPoint = half.add(normalDeriv.scale(scalar));
    // console.log("new point " + newPoint);
    point(newPoint.x, newPoint.y);
  }

  // derivativeT = ((((Date.now() - StartTime) / speed) * 1000 * amtOfCurves) % (1000 * amtOfCurves)) / (1000);
  derivativeT = ((Date.now() - StartTime) / speed) % 1;
  derivativeCurve = Math.floor(
    ((Date.now() - StartTime) / speed) % amtOfCurves
  );
}
function reset() {
  points = new Array(amtOfCurves * 2 + 1);

  var dist = 350 / points.length;
  for (var i = 0; i < points.length; i++) {
    points[i] = new Vector2(25 + i * dist, random(25, 375));
    // console.log(points[i]);
  }
  // console.log(points);
}

function getPoint(p1, p2, p3, t) {
  var x =
    p3.x * pow(t, 2) -
    2 * p2.x * pow(t, 2) +
    2 * p2.x * pow(t, 1) +
    1 * p1.x * pow(t, 2) -
    2 * p1.x * pow(t, 1) +
    1 * p1.x * pow(t, 0);
  var y =
    p3.y * pow(t, 2) -
    2 * p2.y * pow(t, 2) +
    2 * p2.y * pow(t, 1) +
    1 * p1.y * pow(t, 2) -
    2 * p1.y * pow(t, 1) +
    1 * p1.y * pow(t, 0);

  return new Vector2(x, y);
}

function getDerivative(p1, p2, p3, t) {
  var x = 2 * p3.x * t - 4 * p2.x * t + 2 * p2.x + 2 * p1.x * t - 2 * p1.x;
  var y = 2 * p3.y * t - 4 * p2.y * t + 2 * p2.y + 2 * p1.y * t - 2 * p1.y;
  return new Vector2(x, y);
}

function Vector2(x, y) {
  this.x = x;

  this.y = y;
  this.magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  this.Dist = function (point) {
    return sqrt(pow(x - point.x, 2) + pow(y - point.y, 2));
  };
  this.add = function (point) {
    return new Vector2(this.x + point.x, this.y + point.y);
  };
  this.scale = function (scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  };
  // this.normalize() = function () {
  //     return this.scale(1 / this.magnitude);
  // };
}

function checkKeyboard() {
  if (keyWentDown("RIGHT_ARROW")) {
    amtOfCurves++;
    reset();
  }
  if (keyWentDown("LEFT_ARROW")) {
    amtOfCurves--;
    reset();
  }
  if (keyWentDown("R")) {
    reset();
  }
}

function checkMouse() {
  var mousePos = new Vector2(World.mouseX, World.mouseY);
  if (mouseWentDown("leftButton")) {
    // console.log(mousePos);
    // console.log(points[0]);
    closestIndex = 0;
    var closestDist = mousePos.Dist(points[0]);
    for (var i = 0; i < points.length; i++) {
      if (mousePos.Dist(points[i]) < closestDist) {
        closestIndex = i;
        closestDist = mousePos.Dist(points[i]);
      }
    }
    console.log(closestDist);
    if (closestDist > 15) {
      closestIndex = -1;
    }
  } else if (mouseDown("leftButton")) {
    if (closestIndex != -1) {
      points[closestIndex] = mousePos;
    }
  } else {
    closestIndex = -1;
  }
}
