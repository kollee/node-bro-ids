var Tail = require('tail-forever'),
evt = require('events');

function bro(directory, handler) {
  evt.EventEmitter.call(this);
  bro.prototype.__proto__ = evt.EventEmitter.prototype;
  for (name in handler) {
    this.on(name, handler[name]);
  }
  for (name in handler) {
    tail = new Tail(directory + '/' + name + '.log', {start: 0});
    var self = this;
    tail.on("line", function (data) {
      try {
        var broEvent = JSON.parse(data);
        if (broEvent.ts)
          broEvent.ts = new Date(broEvent.ts * 1000);
        broEvent.event_source = name;
        self.emit(name, broEvent);
      } catch (ex) {
        console.log('error parsing log - not in json format? - ', ex);
      }
    });
  }
}

module.exports = bro
