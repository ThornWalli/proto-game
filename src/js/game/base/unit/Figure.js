'use strict';

import Unit from '../Unit';
import Action from './abstract/Action';
import Moveable from './abstract/Moveable';

const TYPE = 'figure';

class Figure extends Moveable(Action(Unit)) {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = true;
        this.walkable = false;
    }
}

export {
    Figure as
    default, TYPE
};
