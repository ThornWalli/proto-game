'use strict';

import Action from '../Action';
import {
    timer
} from '../Timer';

export default class Collect extends Action {
    constructor(unit, callback) {
        super('collect', unit, callback);
    }

    onComplete() {
        Action.prototype.onComplete.apply(this, arguments);
    }

    /*
     * Functions
     */

    set(resourceUnit) {
        this._resourceUnit = resourceUnit;
    }

    start() {
        Action.prototype.start.apply(this, arguments);
console.log('????');
            // this._resourceUnit.remove();
            // this.onComplete();
        timer.setTimeout(() => {
            this._resourceUnit.remove();
            this.onComplete();
        }, 3000);

    }

    stop() {
        Action.prototype.stop.apply(this, arguments);
    }
}
