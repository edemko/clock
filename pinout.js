function thePinout() { return {

now: (function (){ // DEBUG
    var self = {
        _elem: document.querySelector("#now"),
    }
    return self
})(),
here: (function(){
    var geolocation = document.querySelector("#geolocation")
    var coords = document.querySelector("#local-coords")
    var zenith = coords.querySelector("circle")
    var self = {
        _elem: geolocation,
        _elems: [ geolocation.querySelector("input[name='lat']"), geolocation.querySelector("input[name='lon']") ],
        get value() {
            var lat = self._elems[0].value
            var lon = self._elems[1].value
            return (lat === null || lon === null) ? null : [lat, lon]
        },
        set value(latlon) {
            if (latlon === null) {
                latlon = [null, null]
            }
            self._elems[0].value = latlon[0]
            self._elems[1].value = latlon[1]

        },
        draw_local_coords: function() {
            var latlon = self.value
            if (latlon === null) {
                // TODO hide coordinate system
            }
            else {
                var theta_z = Math.abs(latlon[0]) * (2*Math.PI/360)
                zenith.setAttribute("cy", -0.66188*Math.cos(theta_z) / (1 + Math.sin(theta_z)))
            }
        }
    }
    return self
})(),


////// Alarms //////

alarm: (function(){
    var self = {
        // _configElems: document.querySelector("#alarm-config"), // TODO
        _drawElems: document.querySelector("#alarms"),
        add: function (time) {
            // TODO reusable make svg element
            var svgns = "http://www.w3.org/2000/svg"
            var shape = document.createElementNS(svgns, "path")
            shape.setAttribute("d", "M0.004,0 L0,0.8 L-0.004,0 Z")
            shape.setAttribute("transform", "rotate("+360*percentFromMidnight(time)+")")
            shape.setAttribute("class", "hand")
            self._drawElems.appendChild(shape)
        }
    }
    return self
})(),


////// Visual Time Display //////

cycles: {
    day: (function(){
        var self = {
            _telem: document.querySelector("#dayText"),
            _elem: document.querySelector("#clock #hour"),
            set time(time) {
                var t = percentFromMidnight(time)
                self._telem.textContent = t + "%"
                self._elem.setAttribute('transform', "rotate("+ t*360 +")")
            },
        }
        return self
    })(),
    week: (function(){
        var self = {
            _telem: document.querySelector("#weekText"),
            set time(time) {
                time = moment(time)
                var daysFromMon = (time.day() + 6) % 7
                var dayName = moment.weekdaysShort()[time.day()]

                self._telem.textContent = daysFromMon + " (" + dayName + ")"
            },
        }
        return self
    })(),
    year: (function(){
        var self = {
            _telem: document.querySelector("#yearText"),
            _elem: document.querySelector("#clock #year"),
            set time(time) {
                var t = percentFromVernalEquinox(time)
                self._telem.textContent = t + "%"
                self._elem.setAttribute('transform', "rotate("+t*360+")")
            },
        }
        return self
    })(),
},


////// Linguistic Time Display //////

// TODO humanized form
classic: (function(){
    var self = {
        _elem: document.querySelector("#classicText"),
        set time(time) {
            var year = "1" + time.getFullYear()
            var month = time.getMonth() + 1
            var day = time.getDate()
            var hour = time.getHours()
            var minute = time.getMinutes()
            var second = time.getSeconds()
            var timezone = time.getTimezoneOffset()
            timezone = "UTC" + (timezone < 0 ? "+" : "-") + timezone / 60
            self._elem.textContent = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second+" "+timezone
        },
    }
    return self
})(),





}}