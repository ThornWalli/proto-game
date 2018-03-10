'use strict';
import uuid from 'uuid';
import Events from './Events';
import Position from './Position';

const TYPE = 'default';

class Unit extends Events {
    constructor() {
        super();

        this._id = uuid();

        /**
         * Aktuelle Position.
         * @type {Position}
         */
        this.position = new Position();
        /**
         * Wenn gesetzt ist Unit ausgewählt.
         * @type {Boolean}
         */
        this.isSelected = false;
        /**
         * Wenn gesetzt, kann Unit ausgewählt werden.
         * @type {Boolean}
         */
        this.selectable = false;
        /**
         * Wenn gesetzt, steht Unit nicht im Weg.
         * @type {Boolean}
         */
        this.walkable = true;

        this._lastPosition = new Position();

        this._types = [];
        this.setType(TYPE);

    }

    // Functions

    setPosition(position) {
        this.setPositionValues(position.x, position.y);
    }
    setPositionValues(x, y) {
        this._lastPosition.setLocal(this.position);
        this.position.setValuesLocal(x, y);
        this.trigger('change.position', this.position, this._lastPosition, this);
    }

    remove() {
        this.trigger('remove', this);
    }

    destroy() {
        this.detacheEvents();
        // unit.off(null, null, this);
    }

    isType(type) {
        if (typeof type !== 'string') {
            type = type.type;
        }
        return this._types.indexOf(type) > -1;
    }

    // Properties

    get id() {
        return this._id;
    }

    get type() {
        return this._types[this._types.length - 1];
    }

    setType(type) {
        this._types.push(type);
    }

}

export {
    Unit as
    default, TYPE
};
