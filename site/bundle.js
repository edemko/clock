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

function runAndId(f) {
  f();
  return f;
}

document.addEventListener("PinoutReady", function () {
  var theAlarm = Pinout.alarms._elems[0]; // FIXME

  var sound = new Audio("tng_bridge_1.mp3"); // FIXME move into Pinout.soundboard

  function update(time) {
    Pinout.clockface.hour = time;
    Pinout.clockface.ecliptic = time; // TODO update this less often

    theAlarm.tick();

    if (theAlarm.state === "active") {
      if (sound.paused) {
        // FIXME use a soundboard
        sound.play();
      }
    }
  }

  Pinout.geolocation._elem.addEventListener("input", runAndId(function () {
    return Pinout.planisphere.latlon = Pinout.geolocation.value;
  }));

  Pinout.now._elem.addEventListener("click", function () {
    if (sound.paused) {
      sound.play();
    } else {
      sound.pause();
      sound.currentTime = 0;
    }
  });

  theAlarm._elem.enable.addEventListener("click", function (evt) {
    evt.preventDefault();
    var state = self.state;

    if (state === "stored") {
      self.state = "primed";
    } else if (state === "primed") {
      self.state = "stored";
    } else if (state === "active") {} else if (state === "snooze") {}
  });

  theAlarm._elem.enable.addEventListener('click', function () {
    theAlarm.enabled = !theAlarm.enabled;
    Pinout.clockface.alarms = [theAlarm];
  });

  theAlarm._elem.time.addEventListener('input', runAndId(function () {
    return Pinout.clockface.alarms = [theAlarm];
  }));

  setInterval(runAndId(function () {
    return update(new Date());
  }), 1000);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.planisphere = exports.geolocation = exports.alarms = exports.clockface = exports.now = void 0;

var Maths = _interopRequireWildcard(__webpack_require__(2));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pinout = null;
document.addEventListener("DOMContentLoaded", function () {
  var inits = [now, clockface, alarms, geolocation, planisphere];

  for (var _i = 0; _i < inits.length; _i++) {
    var pin = inits[_i];

    pin._init();

    delete pin._init;
    Object.freeze(pin);
  }

  document.dispatchEvent(new CustomEvent("PinoutReady"));
});
var now = {
  // DELME
  _elem: null,
  _init: function _init() {
    now._elem = document.querySelector("#now");
  }
};
exports.now = now;
var clockface = {
  _elem: {
    day: null,
    year: null,
    alarms: null
  },
  _init: function _init() {
    clockface._elem.day = document.querySelector("#clock #hour");
    clockface._elem.year = document.querySelector("#clock #year");
    clockface._elem.alarms = document.querySelector("#alarms");
  },

  set hour(datetime) {
    var t = Maths.percentFromMidnight(datetime);

    clockface._elem.day.setAttribute("transform", "rotate(".concat(t * 360, ")"));
  },

  set ecliptic(datetime) {
    var t = Maths.percentFromVernalEquinox(datetime);

    clockface._elem.year.setAttribute("transform", "rotate(".concat(t * 360, ")"));
  },

  set alarms(alarms) {
    while (clockface._elem.alarms.childNodes.length) {
      clockface._elem.alarms.removeChild(clockface._elem.alarms.childNodes[0]);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = alarms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _alarm = _step.value;
        var time = _alarm.time;

        if (_alarm.enabled && time !== null) {
          // TODO reusable make svg element
          var svgns = "http://www.w3.org/2000/svg";
          var shape = document.createElementNS(svgns, "path");
          shape.setAttribute("d", "M0.004,0 L0,0.8 L-0.004,0 Z");
          shape.setAttribute("transform", "rotate(".concat(Maths.percentFromMidnight(time) * 360, ")"));
          shape.setAttribute("class", "hand");

          clockface._elem.alarms.appendChild(shape);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

}; // TODO refactor this to elsewhere
// FIXME pull out magic strings

exports.clockface = clockface;

var Alarm =
/*#__PURE__*/
function () {
  // NOTE this is just the (configurable) state machine, as represented in DOM
  function Alarm(pinout) {
    _classCallCheck(this, Alarm);

    this._elem = pinout;
    Object.freeze(this);
  }

  _createClass(Alarm, [{
    key: "tick",
    value: function tick() {
      if (this.state === "primed") {
        this._tryToActivate();
      } else if (this.state === "snooze") {
        this._tryToActivate();
      } else {}
    } // TODO snooze
    // TODO turn off

  }, {
    key: "_tryToActivate",
    value: function _tryToActivate() {
      var now = new Date();
      var activeTime = this.time;

      if (now.getHours() === activeTime.getHours() && now.getMinutes() === activeTime.getMinutes()) {
        this._state = "active";
      }
    }
  }, {
    key: "state",
    get: function get() {
      // FIXME this is quite fast-and-loose
      return Array.filter(this._elem.state, function (x) {
        return x.checked;
      })[0].value; // TODO is there a way in es6 to `[].filter`?
    }
  }, {
    key: "_state",
    set: function set(new_state) {
      var old_state = this.state;

      if (new_state !== old_state) {
        Array.filter(this._elem.state, function (x) {
          return x.value === new_state;
        })[0].checked = true; // FIXME dispatch a change event
      }
    }
  }, {
    key: "time",
    get: function get() {
      // FIXME I don't want to have to do this much parsing, this badly
      var pre = this._elem.time.value;
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
  }, {
    key: "enabled",
    get: function get() {
      return this.state === "stored" ? false : true;
    },
    set: function set(x) {
      if (this.state === "stored" && x) {
        this._state = "primed";
      } else if (this.state === "primed" && !x) {
        this._state = "stored";
      }
    }
  }]);

  return Alarm;
}(); // TODO features for multiple alarms


var alarms = {
  _elems: [],
  _init: function _init() {
    var div = document.querySelector("#alarm-configs");

    alarms._elems.push(new Alarm({
      state: div.querySelectorAll("input[name='state']"),
      enable: div.querySelector("button[name='enable']"),
      time: div.querySelector("input[name='time']")
    }));
  }
};
exports.alarms = alarms;
var soundboard = null; // TODO this is where I'll put the code for playback, independent of alarm configuration

var geolocation = {
  // TODO lat/lon detected by device or input by user
  _elem: null,
  _elems: null,
  _init: function _init() {
    geolocation._elem = document.querySelector("#geolocation");
    geolocation._elems = {
      lat: geolocation._elem.querySelector("input[name='lat']"),
      lon: geolocation._elem.querySelector("input[name='lon']")
    };
  },

  get value() {
    var lat = geolocation._elems.lat.value;
    var lon = geolocation._elems.lon.value;
    return {
      lat: lat,
      lon: lon
    };
  }

};
exports.geolocation = geolocation;
var planisphere = {
  _elem: {
    coords: null,
    zenith: null // TODO altitudes (alumcantars? sp?)

  },
  _init: function _init() {
    planisphere._elem.coords = document.querySelector("#local-coords"), planisphere._elem.zenith = planisphere._elem.coords.querySelector("circle");
  },

  set latlon(_ref) {
    var lat = _ref.lat,
        lon = _ref.lon;

    if (lat === null) {// TODO hide coordinate system
    } else {
      var theta_z = Math.abs(lat) * (2 * Math.PI / 360);

      planisphere._elem.zenith.setAttribute("cy", -0.66188 * Math.cos(theta_z) / (1 + Math.sin(theta_z)));
    }
  }

}; // TODO humanized form of linguistic time display

exports.planisphere = planisphere;

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