document.addEventListener("DOMContentLoaded", function () {
    window.pinout = thePinout()
    document.dispatchEvent(new CustomEvent("PinoutReady"))
})

document.addEventListener("PinoutReady", function () {
    var sound = new Audio("tng_bridge_1.mp3") // FIXME move into pinout


    function update(time) {
        pinout.cycles.day.time = time
        pinout.cycles.week.time = time
        pinout.cycles.year.time = time
        pinout.classic.time = time
        var alarmTime = pinout.alarm_config.time
        if (alarmTime !== null
            && pinout.alarm_config.state === "primed"
            && time.getHours() === alarmTime.getHours()
            && time.getMinutes() === alarmTime.getMinutes()) {
            if (sound.paused) { // FIXME the alarm deserves a real state machine with a real design
                sound.play()
            }
        }
    }

    pinout.here.draw_local_coords()
    pinout.here._elem.addEventListener("input", function () {
        pinout.here.draw_local_coords()
    })

    pinout.now._elem.addEventListener("click", function () {
        if (sound.paused) {
            sound.play()
        }
        else {
            sound.pause()
            sound.currentTime = 0
        }
    })

    pinout.alarm_config._elem.time.addEventListener('input', function () {
        pinout.alarm.time = pinout.alarm_config.time
    })
    pinout.alarm.time = pinout.alarm_config.time

    update(new Date())
    window.setInterval(function () { update(new Date()) }, 1000)
})

