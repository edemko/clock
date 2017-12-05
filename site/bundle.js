/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pinout = _interopRequireWildcard(__webpack_require__(1));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

document.addEventListener("PinoutReady", function () {
  var sound = new Audio("tng_bridge_1.mp3"); // FIXME move into pinout

  function update(time) {
    Pinout.pinout.cycles.day.time = time;
    Pinout.pinout.cycles.week.time = time;
    Pinout.pinout.cycles.year.time = time;
    Pinout.pinout.classic.time = time;
    var alarmTime = Pinout.pinout.alarm_config.time;

    if (alarmTime !== null && Pinout.pinout.alarm_config.state === "primed" && time.getHours() === alarmTime.getHours() && time.getMinutes() === alarmTime.getMinutes()) {
      if (sound.paused) {
        // FIXME the alarm deserves a real state machine with a real design
        sound.play();
      }
    }
  }

  Pinout.pinout.here.draw_local_coords();

  Pinout.pinout.here._elem.addEventListener("input", function () {
    return Pinout.pinout.here.draw_local_coords();
  });

  Pinout.now._elem.addEventListener("click", function () {
    if (sound.paused) {
      sound.play();
    } else {
      sound.pause();
      sound.currentTime = 0;
    }
  });

  Pinout.pinout.alarm_config._elem.time.addEventListener('input', function () {
    return Pinout.pinout.alarm.time = Pinout.pinout.alarm_config.time;
  });

  Pinout.pinout.alarm.time = Pinout.pinout.alarm_config.time;
  update(new Date());
  window.setInterval(function () {
    return update(new Date());
  }, 1000);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = exports.pinout = void 0;

var Maths = _interopRequireWildcard(__webpack_require__(2));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var pinout = null;
exports.pinout = pinout;
document.addEventListener("DOMContentLoaded", function () {
  var _arr = [now];

  for (var _i = 0; _i < _arr.length; _i++) {
    var pin = _arr[_i];

    pin._init();

    delete pin._init;
    Object.freeze(pin);
  }

  exports.pinout = pinout = thePinout();
  document.dispatchEvent(new CustomEvent("PinoutReady"));
});
var now = {
  _elem: null,
  _init: function _init() {
    now._elem = document.querySelector("#now");
  }
};
exports.now = now;

function thePinout() {
  return {
    here: function () {
      var geolocation = document.querySelector("#geolocation");
      var coords = document.querySelector("#local-coords");
      var zenith = coords.querySelector("circle");
      var self = {
        _elem: geolocation,
        _elems: [geolocation.querySelector("input[name='lat']"), geolocation.querySelector("input[name='lon']")],

        get value() {
          var lat = self._elems[0].value;
          var lon = self._elems[1].value;
          return lat === null || lon === null ? null : [lat, lon];
        },

        set value(latlon) {
          if (latlon === null) {
            latlon = [null, null];
          }

          self._elems[0].value = latlon[0];
          self._elems[1].value = latlon[1];
        },

        draw_local_coords: function draw_local_coords() {
          var latlon = self.value;

          if (latlon === null) {// TODO hide coordinate system
          } else {
            var theta_z = Math.abs(latlon[0]) * (2 * Math.PI / 360);
            zenith.setAttribute("cy", -0.66188 * Math.cos(theta_z) / (1 + Math.sin(theta_z)));
          }
        }
      };
      return self;
    }(),
    ////// Alarms //////
    alarm: function () {
      var self = {
        _drawElems: document.querySelector("#alarms"),

        set time(time) {
          while (self._drawElems.childNodes.length) {
            self._drawElems.removeChild(self._drawElems.childNodes[0]);
          }

          if (time !== null) {
            // TODO reusable make svg element
            var svgns = "http://www.w3.org/2000/svg";
            var shape = document.createElementNS(svgns, "path");
            shape.setAttribute("d", "M0.004,0 L0,0.8 L-0.004,0 Z");
            shape.setAttribute("transform", "rotate(" + 360 * Maths.percentFromMidnight(time) + ")");
            shape.setAttribute("class", "hand");

            self._drawElems.appendChild(shape);
          }
        }

      };
      return self;
    }(),
    alarm_config: function () {
      var div = document.querySelector("#alarm-configs");
      var self = {
        _elem: {
          state: div.querySelectorAll("input[name='state']"),
          enable: div.querySelector("button[name='enable']"),
          time: div.querySelector("input[name='time']")
        },

        get state() {
          return Array.filter(self._elem.state, function (x) {
            return x.checked;
          })[0].value;
        },

        set state(new_state) {
          var old_state = self.state;

          if (new_state !== old_state) {
            Array.filter(self._elem.state, function (x) {
              return x.value === new_state;
            })[0].checked = true; // FIXME dispatch a change event
          }
        },

        get time() {
          var pre = self._elem.time.value;
          var bits = pre.split(":");
          var hour = bits[0];
          var minute = bits[1];

          if (hour === undefined) {
            return null;
          }

          if (minute === undefined) {
            minute = 0;
          }

          var alarmTime = new Date();
          alarmTime.setHours(hour, minute, 0, 0);
          return alarmTime;
        }

      }; // FIXME this event listener should go in some sort of initializer

      self._elem.enable.addEventListener('click', function (e) {
        e.preventDefault();
        var state = self.state;

        if (state === "stored") {
          self.state = "primed";
        } else if (state === "primed") {
          self.state = "stored";
        } else if (state === "active") {} else if (state === "snooze") {}
      });

      return self;
    }(),
    ////// Visual Time Display //////
    cycles: {
      day: function () {
        var self = {
          _telem: document.querySelector("#dayText"),
          _elem: document.querySelector("#clock #hour"),

          set time(time) {
            var t = Maths.percentFromMidnight(time);
            self._telem.textContent = t + "%";

            self._elem.setAttribute('transform', "rotate(" + t * 360 + ")");
          }

        };
        return self;
      }(),
      week: function () {
        var self = {
          _telem: document.querySelector("#weekText"),

          set time(time) {
            time = moment(time);
            var daysFromMon = (time.day() + 6) % 7;
            var dayName = moment.weekdaysShort()[time.day()];
            self._telem.textContent = daysFromMon + " (" + dayName + ")";
          }

        };
        return self;
      }(),
      year: function () {
        var self = {
          _telem: document.querySelector("#yearText"),
          _elem: document.querySelector("#clock #year"),

          set time(time) {
            var t = Maths.percentFromVernalEquinox(time);
            self._telem.textContent = t + "%";

            self._elem.setAttribute('transform', "rotate(" + t * 360 + ")");
          }

        };
        return self;
      }()
    },
    ////// Linguistic Time Display //////
    // TODO humanized form
    classic: function () {
      var self = {
        _elem: document.querySelector("#classicText"),

        set time(time) {
          var year = "1" + time.getFullYear();
          var month = time.getMonth() + 1;
          var day = time.getDate();
          var hour = time.getHours();
          var minute = time.getMinutes();
          var second = time.getSeconds();
          var timezone = time.getTimezoneOffset();
          timezone = "UTC" + (timezone < 0 ? "+" : "-") + timezone / 60;
          self._elem.textContent = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + " " + timezone;
        }

      };
      return self;
    }()
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentFromMidnight = percentFromMidnight;
exports.percentFromVernalEquinox = percentFromVernalEquinox;
exports.offsetRadiusIntersectsCircle = offsetRadiusIntersectsCircle;

function percentFromMidnight(time) {
  time = moment(time); // FIXME doesn't account for leap seconds
  // TODO extend moment with secondOfDay

  var secondsFromMidnight = 60 * 60 * time.hour() + 60 * time.minute() + time.second();
  return secondsFromMidnight / (60 * 60 * 24);
}

function percentFromVernalEquinox(time) {
  time = moment(time); // FIXME doesn't account for leap years
  // FIXME doesn't account for precession of the equinox

  var vernal_equinox = moment(new Date(time.year(), 2, 20));
  var daysFromVernalEquinox = time.dayOfYear() - vernal_equinox.dayOfYear();

  if (daysFromVernalEquinox < 0) {
    daysFromVernalEquinox += 365; // FIXME accounting from the wrong year's equinox
  }

  return daysFromVernalEquinox / 365;
}

function offsetRadiusIntersectsCircle(delta, r, phi) {
  var theta = phi + Math.asin(delta / r * Math.sin(phi));
  return [Math.cos(theta), Math.sin(theta)];
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map