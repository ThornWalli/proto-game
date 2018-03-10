'use strict';

import Events from './Events';

export default class Action extends Events {
    constructor(type, unit, callback) {
        super();
        this._unit = unit;
        this._callback = callback;
        this._type = type || 'default';

        this._started = false;
        this._stopped = false;
        this._completed = false;
    }


    /*
     * Functions
     */


    onComplete() {
        this._completed = true;
        this.trigger('complete', this);
        this.stop();
    }

    destroy() {
        this._unit = null;
        this.detacheEvents();
    }

    onStop() {
        this._stopped = true;
        this.trigger('stop', this);
    }

    /**
     * @override
     */
    start() {
        if (!this._stopped) {

            this.trigger('start', this);
        }
        this._stopped = false;
        this._started = true;
    }
    /**
     * @override
     */
    pause() {}
    /**
     * @override
     */
    stop() {
        this._started = false;
        this.trigger('stop', this);
    }
    /**
     * @override
     */
    set() {}

    toString() {
        return `Action: ${this.type}`;
    }

    /*
     * Properties
     */

    get callback() {
        return this._callback;
    }

    get unit() {
        return this._unit;
    }

    get type() {
        return this._type;
    }
}
