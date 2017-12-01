document.addEventListener("DOMContentLoaded", function () {
    window.pinout = thePinout()
    document.dispatchEvent(new CustomEvent("PinoutReady"))
})

document.addEventListener("PinoutReady", function () {
    function update(time) {
        pinout.cycles.day.time = time
        pinout.cycles.week.time = time
        pinout.cycles.year.time = time
        pinout.classic.time = time
        if (time.getHours() === alarmTime.getHours()
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

    var sound = new Audio("tng_bridge_1.mp3")
    pinout.now._elem.addEventListener("click", function () {
        if (sound.paused) {
            sound.play()
        }
        else {
            sound.pause()
            sound.currentTime = 0
        }
    })

    var alarmTime = new Date()
    alarmTime.setHours(7, 30, 0, 0)
    pinout.alarm.add(alarmTime)

    update(new Date())
    window.setInterval(function () { update(new Date()) }, 1000)
})

