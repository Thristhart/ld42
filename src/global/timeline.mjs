class Timeline {
  constructor() {
    this.points = [];
  }
  addPoint(time, callback) {
    var point = {time: time, callback: callback, triggered: false};
    this.points.push(point);
    return point;
  }
  update(newTime) {
    var self = this;
    this.points.forEach(function(point, pointIndex) {
      if(point.triggered) {
        if(point.time > newTime) {
          point.triggered = false;
          if(pointIndex === self.points.length - 1) {
            self.done = false;
          }
        }
        else {
          return false;
        }
      }

      if(point.time <= newTime) {
        point.triggered = true;
        if(pointIndex === self.points.length - 1) {
          self.done = true;
        }
        point.callback();
      }
    });
  }
  thenWait(time, callback) {
    var lastPoint = this.points[this.points.length - 1];
    var lastTime = 0;
    if(lastPoint) {
      lastTime = lastPoint.time;
    }
    this.addPoint(lastTime + time, callback);
  }
}

export default Timeline;