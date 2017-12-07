import * as Maths from 'maths.js'

export {
    now,
    clockface,
    alarms,
    geolocation,
    planisphere,
}

var pinout = null


document.addEventListener("DOMContentLoaded", function () {
    const inits = [
        now,
        clockface,
        alarms,
        geolocation,
        planisphere,
    ]
    for (const pin of inits) {
        pin._init()
        delete pin._init
        Object.freeze(pin)
    }
    document.dispatchEvent(new CustomEvent("PinoutReady"))
})


const now = { // DELME
    _elem: null,
    _init() {
        now._elem = document.querySelector("#now")
    },
}

const clockface = {
    _elem: {
        day: null,
        year: null,
        alarms: null,
    },
    _init() {
        clockface._elem.day = document.querySelector("#clock #hour")
        clockface._elem.year = document.querySelector("#clock #year")
        clockface._elem.alarms = document.querySelector("#alarms")
    },
    set hour(datetime) {
        const t = Maths.percentFromMidnight(datetime)
        clockface._elem.day.setAttribute("transform", `rotate(${t*360})`)
    },
    set ecliptic(datetime) {
        const t = Maths.percentFromVernalEquinox(datetime)
        clockface._elem.year.setAttribute("transform", `rotate(${t*360})`)
    },
    set alarms(alarms) {
        while (clockface._elem.alarms.childNodes.length) { clockface._elem.alarms.removeChild(clockface._elem.alarms.childNodes[0]) }
        for (const alarm of alarms) {
            const time = alarm.time
            if (alarm.enabled && time !== null) {
                // TODO reusable make svg element
                var svgns = "http://www.w3.org/2000/svg"
                var shape = document.createElementNS(svgns, "path")
                shape.setAttribute("d", "M0.004,0 L0,0.8 L-0.004,0 Z")
                shape.setAttribute("transform", `rotate(${Maths.percentFromMidnight(time)*360})`)
                shape.setAttribute("class", "hand")
                clockface._elem.alarms.appendChild(shape)
            }
        }
    },
}

// TODO refactor this to elsewhere
// FIXME pull out magic strings
class Alarm { // NOTE this is just the (configurable) state machine, as represented in DOM
    constructor(pinout) {
        this._elem = pinout
        Object.freeze(this)
    }

    get state() { // FIXME this is quite fast-and-loose
        return Array.filter(this._elem.state, (x) => x.checked)[0].value // TODO is there a way in es6 to `[].filter`?
    }
    set _state(new_state) {
        var old_state = this.state
        if (new_state !== old_state) {
            Array.filter(this._elem.state, (x) => x.value === new_state)[0].checked = true
            // FIXME dispatch a change event
        }
    }
    
    get time() { // FIXME I don't want to have to do this much parsing, this badly
        var pre = this._elem.time.value
        var bits = pre.split(":")
        var hour = bits[0]
        var minute = bits[1]
        if (hour === undefined) {
            return null
        }
        if (minute === undefined) {
            minute = 0
        }
        var alarmTime = new Date()
        alarmTime.setHours(hour, minute, 0, 0)
        return alarmTime
    }
    
    get enabled() {
        return (this.state === "stored") ? false : true
    }
    set enabled(x) {
        if (this.state === "stored" && x) {
            this._state = "primed"
        }
        else if (this.state === "primed" && !x) {
            this._state = "stored"
        }
    }
    tick() {
        if (this.state === "primed") { this._tryToActivate() }
        else if(this.state === "snooze") { this._tryToActivate() }
        else {}
    }
    // TODO snooze
    // TODO turn off
    
    _tryToActivate() {
        const now = new Date()
        const activeTime = this.time
        if (now.getHours() === activeTime.getHours()
        && now.getMinutes() === activeTime.getMinutes()) {
            this._state = "active"
        }
    }
}

// TODO features for multiple alarms
const alarms = {
    _elems: [],
    _init() {
        var div = document.querySelector("#alarm-configs")
        alarms._elems.push(new Alarm({
            state: div.querySelectorAll("input[name='state']"),
            enable: div.querySelector("button[name='enable']"),
            time: div.querySelector("input[name='time']"),
        }))
    },
}
const soundboard = null // TODO this is where I'll put the code for playback, independent of alarm configuration

const geolocation = {
     // TODO lat/lon detected by device or input by user
    _elem: null,
    _elems: null,
    _init() {
        geolocation._elem = document.querySelector("#geolocation")
        geolocation._elems = { lat: geolocation._elem.querySelector("input[name='lat']")
                             , lon: geolocation._elem.querySelector("input[name='lon']") }
    },
    get value() {
        var lat = geolocation._elems.lat.value
        var lon = geolocation._elems.lon.value
        return {lat, lon}
    },
    // TODO set from navigator
}

const planisphere = {
    _elem: {
        coords: null,
        zenith: null,
        // TODO altitudes (alumcantars? sp?)
    },
    _init() {
        planisphere._elem.coords = document.querySelector("#local-coords"),
        planisphere._elem.zenith = planisphere._elem.coords.querySelector("circle")
    },
    set latlon({lat, lon}) {
        if (lat === null) {
            // TODO hide coordinate system
        }
        else {
            var theta_z = Math.abs(lat) * (2*Math.PI/360)
            planisphere._elem.zenith.setAttribute("cy", -0.66188*Math.cos(theta_z) / (1 + Math.sin(theta_z)))
        }
    },
}

// TODO humanized form of linguistic time display
