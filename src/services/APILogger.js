class APILogger {

    constructor () {
        this.logLevel = 0
        this.hasLogging = false
        this.entries = []
    }

    getEntries () {
        return this.entries
    }
  
    setLogLevel (l) {
        this.logLevel = l
    }

    space (level, msg, space= '  ') {
        let result = ''
        for (let i = 0; i < level; i++) {
            result += space
        }
        console.debug(result + msg)
    }
  
    warn(msg, obj) {
        this.save(100, msg, obj)
        if (obj !== undefined) {
            console.warn(msg, obj)
        } else {
            console.warn(msg)
        }
    }
    error(msg, obj) {
        this.save(1000, msg, obj)
        if (obj !== undefined) {
            console.error(msg, obj)
        } else {
            console.error(msg)
        }
    }
    log(level, msg, obj, obj2) {
        this.save(level, msg, obj)
        if (level < this.logLevel) {
            if (obj !== undefined) {
                if (obj2) {
                    console.debug(msg, obj, obj2)
                } else {
                    console.debug(msg, obj)
                }
            } else {
                console.debug(msg)
            }
        }
    }

    save (level, msg, obj,) {
        if (this.hasLogging) {
            if (this.entries.length > 200) {
                this.entries.shift()
            }
            this.entries.push({
                level: level,
                msg: msg,
                obj: JSON.stringify(obj)
            })
        }
    }
  }
  export default new APILogger()