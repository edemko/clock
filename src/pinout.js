import * as Maths from 'maths.js'
import {Alarm} from 'alarm.js'

export {
    test_buttons,
    clockface,
    alarms,
    geolocation,
    planisphere,
}

var pinout = null


document.addEventListener("DOMContentLoaded", function () {
    const inits = [
        test_buttons,
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


const test_buttons = { // DELME
    _elem: { a: null, b: null },
    _init() {
        test_buttons._elem.a = document.querySelector("#now")
        test_buttons._elem.b = document.querySelector("#alarm-configs").querySelector("button[name='enable']")
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


// TODO features for multiple alarms
const alarms = {
    _elems: [],
    _init() {
        var div = document.querySelector("#alarm-configs")
        alarms._elems.push(new Alarm(
            div,
            div.querySelector("input[name='time']"),
        ))
    },
}

const soundboard = null // TODO this is where I'll put the code for playback, independent of alarm configuration

const geolocation = {
    // TODO set from navigator
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
