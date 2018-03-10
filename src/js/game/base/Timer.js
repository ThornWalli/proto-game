'use strict';

import Events from './Events';
import Collection from './Collection';

const DEFAULT_TICK = 1000; // ms

class Timer extends Events {
    constructor(name) {
        super();
        this._name = name;
        this._startTimestamp = null;


        this._listeners = new Collection();
        this._listenerByDurations = new Map();

        this._skipping = false;
    }

    /*
     * Functions
     */

    start() {
        this._startTimestamp = Date.now();
        this.loop(this);
    }
    stop() {}

    skip(milliseconds) {
        this._skipping = true;
        const now = this.now;
        console.log('Skip ms', milliseconds);
        for (var i = 0; i <= milliseconds; i += 100) {
            this.tick(now + i);
        }
        this._skipping = false;
        console.log('XXXX');
        this._listeners.forEach(listener=>{

            listener.timestamp = this.now;
        });
    }

    setTimeout(func, duration) {
        this.register(func, duration, true);
    }

    loop() {
        global.setTimeout(() => {
            if (!this._skipping) {
                this.tick(this.now);
                    console.log('joo');
            } else {
                console.log('hhää');
            }
            this.loop();
        }, 200);
    }

    tick(now) {
        this._currentTick = now;
        const listeners = [].concat(this._listeners.items);
        let listener;
        while (listeners.length) {
            listener = listeners.shift();
            if (listener.tick(now) && listener.once) {
                this._listeners.remove(listener);
            }
        }
        // Array.from(this._listenerByDurations.values()).forEach(listenerGroup => {
        //     listenerGroup.tick(now);
        // });
    }

    register(func, duration = DEFAULT_TICK, once = false) {
        let listener;
        if (func instanceof Listener) {
            listener = func;
        } else {
            listener = new Listener({
                func,
                duration
            });
        }
        let now = this.now;
        if (this._skipping) {
            now = this._currentTick;
        }
        listener.timestamp = now;
        listener.timer = this;
        listener.once = once;
        this._listeners.add(listener);
        // if (!this._listenerByDurations.has(duration)) {
        //     this._listenerByDurations.set(duration, new ListenerGroup(duration, now));
        // }
        // this._listenerByDurations.get(duration).listeners.add(listener);
        return listener;
    }

    unregister(listener) {
        // const listeners = this._listenerByDurations.get(listener.duration).listeners;
        // listeners.remove(listener);
        this._listeners.remove(listener);
    }

    /*
     * Properties
     */

    get startTimestamp() {
        return this._startTimestamp;
    }


    get now() {
        return Date.now();
    }
}

class ListenerGroup {
    constructor(duration, now) {
        this.duration = duration;
        this.timestamp = now;
        this.listeners = new Collection();
    }
    tick(now) {
        const listeners = [].concat(this.listeners.items);
        let listener;
        while (listeners.length) {
            listener = listeners.shift();
            if (listener.tick(now) && listener.once) {
                this.listeners.remove(listener);
            }
        }
    }
}

class Listener {
    constructor({
        func,
        duration,
        timestamp,
        priority = 0
    }) {
        this.timestamp = timestamp;
        this.func = func;
        this.duration = duration;
        this.priority = priority;
        this.timer = null;
        this.once = false;
    }
    tick(now) {
        if ((now - this.timestamp) >= this.duration) {
            this.func(this);
            this.timestamp = now;
            return true;
        }
        return false;
    }
    destroy() {
        this.timer = null;
    }
}

// Create Timer Singleton
const timer = new Timer('Global Timer');
timer.start();

export default Timer;
export {
    timer,
    Timer,
    Listener
};



// 'use strict';
//
// import Events from './Events';
// import Collection from './Collection';
//
// const DEFAULT_TICK = 1000; // ms
//
// class Timer extends Events {
//     constructor(name) {
//         super();
//         this._name = name;
//         this._listeners = new Collection();
//         this._startTimestamp = null;
//
//
//         this._listenerByDurations = new Map();
//
//         this._skipping = false;
//     }
//
//     /*
//      * Functions
//      */
//
//     start() {
//         this._startTimestamp = Date.now();
//         this.loop(this);
//     }
//     stop() {}
//
//     setTimeout(cb, duration) {
//
//     }
//
//     skip(milliseconds) {
//         const now = this.now;
//         this._skipping = true;
//         for (var i = 0; i < milliseconds; i++) {
//             this.tick(now + i);
//         }
//     }
//
//     loop() {
//         global.setTimeout(() => {
//             if (!this._skipping) {
//                 this.tick(this.now);
//             }
//             this.loop();
//         }, 200);
//     }
//
//     tick(now) {
//         Array.from(this._listenerByDurations.values()).forEach(listenerGroup => {
//             listenerGroup.tick(now);
//         });
//     }
//     registerOnce(func, duration) {
//         registerListener.bind(this)(func, duration, true);
//     }
//     register(func, duration) {
//         registerListener.bind(this)(func, duration);
//     }
//
//     unregister(listener) {
//         const listeners = this._listenerByDurations.get(listener.duration).listeners;
//         listeners.remove(listener, {
//             passive: true
//         });
//         this._listeners.remove(listener);
//     }
//
//     /*
//      * Properties
//      */
//
//     get startTimestamp() {
//         return this._startTimestamp;
//     }
//
//
//     get now() {
//         return Date.now();
//     }
// }
//
// function registerListener(func, duration, once = false) {
//     let listener;
//     duration = duration || DEFAULT_TICK;
//     if (func instanceof Listener) {
//         listener = func;
//     } else {
//         listener = new Listener({
//             func,
//             duration
//         });
//     }
//     listener.timer = this;
//     listener.once = once;
//     if (!this._listenerByDurations.has(duration)) {
//         this._listenerByDurations.set(duration, new ListenerGroup(duration));
//     }
//     this._listenerByDurations.get(duration).listeners.add(listener);
//     this._listeners.add(listener);
//     return listener;
// }
//
// class ListenerGroup {
//     constructor(duration) {
//         this.duration = duration;
//         this.timestamp = 0;
//         this.listeners = new Collection();
//     }
//     tick(now) {
//         if ((now - this.timestamp) >= this.duration) {
//             const listeners = [].concat(this.listeners.items);
//             for (var i = 0; i < listeners.length; i++) {
//                 listeners[i].tick();
//                 if (listeners[i].once) {
//                     this.remove(listeners[i]);
//                 }
//             }
//             this.timestamp = now;
//         }
//     }
// }
//
// class Listener {
//     constructor({
//         func,
//         duration,
//         priority = 0
//     }) {
//         this.func = func;
//         this.duration = duration;
//         this.priority = priority;
//         this.once = false;
//         this.timer = null;
//     }
//     tick() {
//         this.func(this);
//     }
//     destroy() {
//         this.timer = null;
//     }
// }
//
// // Create Timer Singleton
// const timer = new Timer('Global Timer');
// timer.start();
//
// export default Timer;
// export {
//     timer,
//     Timer,
//     Listener
// };
