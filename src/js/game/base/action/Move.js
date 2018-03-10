 'use strict';

import Action from '../Action';

import {
    timer
} from '../Timer';

export default class Move extends Action {
    constructor(unit, callback) {
        super('move', unit, callback);
        this._moveData = null;
        this._timerListener = null;
    }

    onComplete() {
        timer.unregister(this._timerListener);
        this._timerListener = null;
        Action.prototype.onComplete.apply(this, arguments);
    }

    /*
     * Functions
     */

    start() {
        addListener(this, this._moveData.path);
        Action.prototype.start.apply(this, arguments);

    }

    stop() {
        Action.prototype.stop.apply(this, arguments);
    }

    set(moveData) {
        this._moveData = moveData;
    }

    getMoveSpeed() {
        return 200; // ms
    }

    destroy() {
        removeListener(this);
        Action.prototype.destroy.apply(this, arguments);
    }

    /*
     * Properties
     */

    get moveData() {
        return this._moveData;
    }
}

function addListener(action, path) {
    action._timerListener = timer.register(() => {
        // Get next Position
        if (path.length < 1) {
            action.onComplete();
        } else {
        const position = path.shift();
        action.unit.setPosition(position);
        }

        // const position = path.pop();
        // action.unit.setPosition(position);
        // action.onComplete();
    }, action.getMoveSpeed());
}

function removeListener(action) {
    if (action._timerListener) {
        timer.unregister(action._timerListener);
    }
}
