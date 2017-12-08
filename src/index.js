import * as Pinout from "pinout.js"

function runAndId(f) {
    f()
    return f
}

document.addEventListener("PinoutReady", () => {
    const theAlarm = Pinout.alarms._elems[0] // FIXME
    var sound = new Audio("tng_bridge_1.mp3") // FIXME move into Pinout.soundboard

    setInterval(runAndId(() => {
        const time = new Date()
        Pinout.clockface.hour = time
        Pinout.clockface.ecliptic = time // TODO update this less often

        theAlarm.tick() // TODO update this only every ~10 seconds (at least 30 sec)
        if (theAlarm.state === "active") {
            if (sound.paused) { // FIXME use a soundboard
                sound.play()
            }
        }
    }), 1000)

    Pinout.geolocation._elem.addEventListener("input", runAndId(() => Pinout.planisphere.latlon = Pinout.geolocation.value))
    
    theAlarm._elem.time.addEventListener('input', runAndId(() => Pinout.clockface.alarms = [theAlarm]))


    Pinout.test_buttons._elem.a.addEventListener("click", () => {
        if (sound.paused) {
            sound.play()
        }
        else {
            sound.pause()
            sound.currentTime = 0
        }
    })

    Pinout.test_buttons._elem.b.addEventListener('click', (evt) => {
        evt.preventDefault()
        theAlarm.enabled = !theAlarm.enabled
        Pinout.clockface.alarms = [theAlarm]
    })

})

