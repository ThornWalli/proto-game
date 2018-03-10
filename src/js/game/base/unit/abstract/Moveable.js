'use strict';

/**
 * Abstract Class Moveable
 */
const Moveable = Unit => class extends Unit {
    constructor() {
        super();
        this._moveData = null;
    }

    /*
     * Functions
     */

    move(moveData) {
        console.log('Unit move:', moveData);
        this.moveData = moveData;
        this.trigger('move', this.moveData);
    }

    /*
     * Properties
     */

    get moveData() {
        return this._moveData;
    }
    set moveData(moveData) {
        this._moveData = moveData;
    }
};

export default Moveable;
