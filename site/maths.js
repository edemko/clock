function percentFromMidnight(time) {
    time = moment(time)
    // FIXME doesn't account for leap seconds
    // TODO extend moment with secondOfDay
    var secondsFromMidnight = 60*60*time.hour() + 60*time.minute() + time.second()
    return secondsFromMidnight / (60*60*24)
}

function percentFromVernalEquinox(time) {
    time = moment(time)
    // FIXME doesn't account for leap years
    // FIXME doesn't account for precession of the equinox
    var vernal_equinox = moment(new Date(time.year(), 2, 20))
    var daysFromVernalEquinox = time.dayOfYear() - vernal_equinox.dayOfYear()
    if (daysFromVernalEquinox < 0) {
        daysFromVernalEquinox += 365 // FIXME accounting from the wrong year's equinox
    }
    return daysFromVernalEquinox / 365
}





function offsetRadiusIntersectsCircle(delta, r, phi) {
    var theta = phi + Math.asin(delta/r * Math.sin(phi))
    return [Math.cos(theta), Math.sin(theta)]
}