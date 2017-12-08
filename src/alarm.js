export { Alarm }


// FIXME pull out magic strings, probably into classes that can represent states
class Alarm {
    constructor(state, time) { // FIXME this should only track the state, the configuration should be in its own element
        this._elem = {
            state: state.querySelectorAll("input[name='state']"),
            next_activate: state.querySelector("input[name='next_activate']"),
            time
        }
        Object.freeze(this)

        this._elem.time.addEventListener('input', () => {
            if (this.enabled) {
                this._elem.next_activate.value = this._nextActivation()
            }
        })
    }

    get state() { // FIXME this is quite fast-and-loose
        return Array.filter(this._elem.state, (x) => x.checked)[0].value // TODO is there a way in es6 to `[].filter`?
        // TODO attach any related information to the state
    }
    set _state(new_state) {
        var old_state = this.state
        if (new_state !== old_state) {
            Array.filter(this._elem.state, (x) => x.value === new_state)[0].checked = true
            // FIXME dispatch a change event on the state radio buttons

            const alarmTime = this.time
            if (new_state === "stored") {
                this._elem.next_activate.value = null
            }
            else if (new_state === "primed" || new_state === "active") {
                this._elem.next_activate.value = this._nextActivation()
            }
            // FIXME dispatch a change event on the next_activate if required
        }
    }
    
    get time() { // FIXME I don't want to have to do this much parsing, this badly
        var pre = this._elem.time.value
        var bits = pre.split(":")
        var hour = bits[0]
        var minute = bits[1]
        if (hour === "") {
            return null
        }
        if (minute === undefined | minute === "") {
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


    _nextActivation() {
        const configTime = this.time
        if (configTime === null) {
            return null
        }
        const now = new Date()

        const nextAlarm = new Date(now)
        nextAlarm.setHours(configTime.getHours(), configTime.getMinutes(), 0, 0)
        if (nextAlarm < now) {
            nextAlarm.setDate(nextAlarm.getDate() + 1)
        }
        return nextAlarm
    }

    _tryToActivate() {
        const now = new Date()
        const activeTime = new Date(this._elem.next_activate.value)
        if (activeTime === null) { return }
        if (now >= activeTime) {
            this._state = "active"
        }
    }
}