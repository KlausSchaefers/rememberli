class Logger {

    constructor () {
        this.logLevel = 0
    }
  
    setLogLevel (l) {
        this.logLevel = l
    }
  
    warn(msg, obj) {
        if (obj !== undefined) {
            console.warn(msg, obj)
        } else {
            console.warn(msg)
        }
    }
    error(msg, obj) {
        if (obj !== undefined) {
            console.error(msg, obj)
        } else {
            console.error(msg)
        }
    }
    log(level, msg, obj, obj2) {
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
  }
  export default new Logger()