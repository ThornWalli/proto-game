'use strict';

import Unit from '../Unit';
import Module from './abstract/Module';

const TYPE = 'store';

class Store extends Module(Unit) {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = true;
        this.walkable = false;
    }
}

export {
    Store as
    default, TYPE
};
