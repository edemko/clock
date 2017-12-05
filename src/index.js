import * as Pinout from "pinout.js"

document.addEventListener("PinoutReady", () => {
    var sound = new Audio("tng_bridge_1.mp3") // FIXME move into pinout


    function update(time) {
        Pinout.pinout.cycles.day.time = time
        Pinout.pinout.cycles.week.time = time
        Pinout.pinout.cycles.year.time = time
        Pinout.pinout.classic.time = time
        var alarmTime = Pinout.pinout.alarm_config.time
        if (alarmTime !== null
            && Pinout.pinout.alarm_config.state === "primed"
            && time.getHours() === alarmTime.getHours()
            && time.getMinutes() === alarmTime.getMinutes()) {
            if (sound.paused) { // FIXME the alarm deserves a real state machine with a real design
                sound.play()
            }
        }
    }

    Pinout.pinout.here.draw_local_coords()
    Pinout.pinout.here._elem.addEventListener("input", () => Pinout.pinout.here.draw_local_coords())

    Pinout.now._elem.addEventListener("click", () => {
        if (sound.paused) {
            sound.play()
        }
        else {
            sound.pause()
            sound.currentTime = 0
        }
    })

    Pinout.pinout.alarm_config._elem.time.addEventListener('input', () => Pinout.pinout.alarm.time = Pinout.pinout.alarm_config.time)
    Pinout.pinout.alarm.time = Pinout.pinout.alarm_config.time

    update(new Date())
    window.setInterval(() => update(new Date()), 1000)
})

