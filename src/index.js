import * as Pinout from "pinout.js"

function runAndId(f) {
    f()
    return f
}

document.addEventListener("PinoutReady", () => {
    const theAlarm = Pinout.alarms._elems[0] // FIXME
    var sound = new Audio("tng_bridge_1.mp3") // FIXME move into Pinout.soundboard

    function update(time) {
        Pinout.clockface.hour = time
        Pinout.clockface.ecliptic = time // TODO update this less often

        theAlarm.tick()
        if (theAlarm.state === "active") {
            if (sound.paused) { // FIXME use a soundboard
                sound.play()
            }
        }
    }

    Pinout.geolocation._elem.addEventListener("input", runAndId(() => Pinout.planisphere.latlon = Pinout.geolocation.value))

    Pinout.now._elem.addEventListener("click", () => {
        if (sound.paused) {
            sound.play()
        }
        else {
            sound.pause()
            sound.currentTime = 0
        }
    })
    theAlarm._elem.enable.addEventListener("click", (evt) => {
        evt.preventDefault()
        var state = self.state
        if (state === "stored") {
            self.state = "primed"
        }
        else if (state === "primed") {
            self.state = "stored"
        }
        else if (state === "active") {}
        else if (state === "snooze") {}
    })

    theAlarm._elem.enable.addEventListener('click', () => {
        theAlarm.enabled = !theAlarm.enabled
        Pinout.clockface.alarms = [theAlarm]
    })
    theAlarm._elem.time.addEventListener('input', runAndId(() => Pinout.clockface.alarms = [theAlarm]))

    setInterval(runAndId(() => update(new Date())), 1000)
})

